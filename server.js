const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// SSR: Intercept root request to inject OG Meta Tags
app.get('/', (req, res) => {
    // 1. Read Content
    fs.readFile(DATA_FILE, 'utf8', (err, jsonString) => {
        if (err) return res.status(500).send("Error reading content");

        let content;
        try {
            content = JSON.parse(jsonString);
        } catch (e) {
            content = {};
        }

        // 2. Read Index HTML
        const indexPath = path.join(__dirname, 'index.html');
        fs.readFile(indexPath, 'utf8', (err, htmlData) => {
            if (err) return res.status(500).send("Error reading index.html");

            // 3. Prepare Values
            const title = (content.meta && content.meta.og_title) ? content.meta.og_title : ((content.hero && content.hero.title) ? `The Wedding of ${content.hero.title}` : "Wedding Invitation");
            const desc = (content.meta && content.meta.og_description) ? content.meta.og_description : ((content.hero && content.hero.date) ? `Undangan Pernikahan. ${content.hero.date}` : "You are invited!");

            // Image Logic: Priority: Meta Image -> Hero Background/Image -> Groom/Bride -> Default
            // Note: Hero bg is usually CSS. Let's stick to what we have or Gallery 1.
            let image = (content.meta && content.meta.og_image) ? content.meta.og_image : "assets/images/gallery-1.png";

            // If still empty or default, try to find a gallery image
            if ((!image || image === "assets/images/gallery-1.png") && content.gallery && content.gallery.length > 0) {
                image = content.gallery[0];
            }

            // Construct Full URLs
            const protocol = req.protocol;
            const host = req.get('host');
            const fullUrl = `${protocol}://${host}${req.originalUrl}`;

            let imageUrl = image;
            if (image && !image.startsWith('http')) {
                imageUrl = `${protocol}://${host}/${image}`;
            }

            // 4. Inject into HTML using Regex to be safe against different default values
            let injectedHtml = htmlData
                // Title (Tag and OG)
                .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
                .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`)

                // Description
                .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`)
                .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${desc}">`)

                // Image
                .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${imageUrl}">`)

                // URL
                .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${fullUrl}">`);

            res.send(injectedHtml);
        });
    });
});

app.use(express.static(path.join(__dirname, '.'))); // Serve static files

const DATA_FILE = path.join(__dirname, 'content.json');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'assets/uploaded/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- API Endpoints ---

// Get Content
app.get('/api/content', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data');
        }
        res.json(JSON.parse(data));
    });
});

// Update Content
app.post('/api/content', (req, res) => {
    // Basic "auth" check could go here
    const newContent = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newContent, null, 4), (err) => {
        if (err) {
            console.error('Error saving content:', err);
            return res.status(500).send('Error saving data');
        }
        res.json({ message: 'Content updated successfully' });
    });
});

// Upload Image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    const relativePath = 'assets/uploaded/' + req.file.filename;
    res.json({ path: relativePath });
});

// --- Guest Management ---
app.get('/api/guests', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');
        const content = JSON.parse(data);
        res.json(content.guests || []);
    });
});

app.post('/api/guests', (req, res) => {
    const newGuests = req.body; // Array of {name, phone, link}
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');
        const content = JSON.parse(data);

        if (!content.guests) content.guests = [];
        content.guests.push(...newGuests);

        fs.writeFile(DATA_FILE, JSON.stringify(content, null, 4), (err) => {
            if (err) {
                console.error('Error adding guests:', err);
                return res.status(500).send('Error saving');
            }
            res.json({ message: 'Guests added' });
        });
    });
});

app.delete('/api/guests/:index', (req, res) => {
    const index = parseInt(req.params.index);
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');
        const content = JSON.parse(data);

        if (content.guests && content.guests.length > index) {
            content.guests.splice(index, 1);
            fs.writeFile(DATA_FILE, JSON.stringify(content, null, 4), (err) => {
                if (err) return res.status(500).send('Error saving');
                res.json({ message: 'Guest deleted' });
            });
        } else {
            res.status(400).send('Invalid index');
        }
    });
});

// RSVP Endpoints
app.post('/api/rsvp', (req, res) => {
    const rsvpData = req.body; // { name, status, count, message }
    rsvpData.date = new Date().toISOString();

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');
        const content = JSON.parse(data);

        if (!content.rsvp_responses) content.rsvp_responses = [];
        content.rsvp_responses.push(rsvpData);

        fs.writeFile(DATA_FILE, JSON.stringify(content, null, 4), (err) => {
            if (err) return res.status(500).send('Error saving');
            res.json({ message: 'RSVP Saved' });
        });
    });
});

app.get('/api/rsvp_data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');
        const content = JSON.parse(data);
        res.json(content.rsvp_responses || []);
    });
});

// Simple Login (Mock)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.json({ token: 'mock-jwt-token' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
