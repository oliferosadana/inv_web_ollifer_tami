let currentContent = {};

// Check auth on load
if (localStorage.getItem('token')) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    fetchContent();
}

function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Login failed');
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            location.reload();
        })
        .catch(() => {
            document.getElementById('loginError').style.display = 'block';
        });
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

function showTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.querySelectorAll('.card').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
}

function fetchContent() {
    fetch('/api/content')
        .then(res => res.json())
        .then(data => {
            currentContent = data;
            populateForms(data);
        });
}

function populateForms(data) {
    // Hero
    document.getElementById('hero_title').value = data.hero.title;
    document.getElementById('hero_subtitle').value = data.hero.subtitle;
    document.getElementById('hero_date').value = data.hero.date;
    document.getElementById('hero_weddingDateIso').value = data.hero.weddingDateIso;
    if (data.hero.music) document.getElementById('music_preview').src = data.hero.music;

    // Couple
    document.getElementById('groom_name').value = data.couple.groom_name;
    document.getElementById('groom_parents').value = data.couple.groom_parents;
    if (data.couple.groom_img) document.getElementById('groom_preview').src = data.couple.groom_img;

    document.getElementById('bride_name').value = data.couple.bride_name;
    document.getElementById('bride_parents').value = data.couple.bride_parents;
    if (data.couple.bride_img) document.getElementById('bride_preview').src = data.couple.bride_img;

    // Event
    document.getElementById('akad_time').value = data.event.akad_time;
    document.getElementById('akad_location').value = data.event.akad_location;
    document.getElementById('resepsi_time').value = data.event.resepsi_time;
    document.getElementById('resepsi_location').value = data.event.resepsi_location;

    // RSVP
    document.getElementById('bank_name').value = data.rsvp.bank_name;
    document.getElementById('account_number').value = data.rsvp.account_number;
    document.getElementById('account_name').value = data.rsvp.account_name;
    document.getElementById('ewallet_name').value = data.rsvp.ewallet_name || '';
    document.getElementById('ewallet_number').value = data.rsvp.ewallet_number || '';
    document.getElementById('ewallet_owner').value = data.rsvp.ewallet_owner || '';

    // Theme (Safe check in case old content.json doesn't have it)
    if (data.theme) {
        document.getElementById('primary_color').value = data.theme.primary_color;
        document.getElementById('primary_color_text').value = data.theme.primary_color;
        document.getElementById('secondary_color').value = data.theme.secondary_color;
        document.getElementById('secondary_color_text').value = data.theme.secondary_color;
        document.getElementById('bg_color').value = data.theme.bg_color;
        document.getElementById('bg_color_text').value = data.theme.bg_color;

        document.getElementById('font_signature').value = data.theme.font_signature;
        document.getElementById('font_heading').value = data.theme.font_heading;
        document.getElementById('font_body').value = data.theme.font_body;
    }

    // Gallery Grid
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';
    data.gallery.forEach((src, index) => {
        const div = document.createElement('div');
        div.style.position = 'relative';
        div.innerHTML = `
            <img src="${src}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px;">
            <button onclick="deleteFromGallery(${index})" style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; padding: 2px 6px; cursor: pointer; border-radius: 0 5px 0 5px;">&times;</button>
        `;
        galleryGrid.appendChild(div);
    });
}

function saveContent() {
    // Collect data back to object
    currentContent.hero.title = document.getElementById('hero_title').value;
    currentContent.hero.subtitle = document.getElementById('hero_subtitle').value;
    currentContent.hero.date = document.getElementById('hero_date').value;
    currentContent.hero.weddingDateIso = document.getElementById('hero_weddingDateIso').value;
    // Music path is already in currentContent.hero.music if updated via uploadMusic

    currentContent.couple.groom_name = document.getElementById('groom_name').value;
    currentContent.couple.groom_parents = document.getElementById('groom_parents').value;
    currentContent.couple.bride_name = document.getElementById('bride_name').value;
    currentContent.couple.bride_parents = document.getElementById('bride_parents').value;

    currentContent.event.akad_time = document.getElementById('akad_time').value;
    currentContent.event.akad_location = document.getElementById('akad_location').value;
    currentContent.event.akad_address = document.getElementById('akad_address').value;
    currentContent.event.akad_map_link = document.getElementById('akad_map_link').value;
    currentContent.event.resepsi_time = document.getElementById('resepsi_time').value;
    currentContent.event.resepsi_location = document.getElementById('resepsi_location').value;
    currentContent.event.resepsi_address = document.getElementById('resepsi_address').value;
    currentContent.event.resepsi_map_link = document.getElementById('resepsi_map_link').value;

    currentContent.rsvp.bank_name = document.getElementById('bank_name').value;
    currentContent.rsvp.account_number = document.getElementById('account_number').value;
    currentContent.rsvp.account_name = document.getElementById('account_name').value;
    currentContent.rsvp.ewallet_name = document.getElementById('ewallet_name').value;
    currentContent.rsvp.ewallet_number = document.getElementById('ewallet_number').value;
    currentContent.rsvp.ewallet_owner = document.getElementById('ewallet_owner').value;

    if (!currentContent.theme) currentContent.theme = {};
    currentContent.theme.primary_color = document.getElementById('primary_color').value;
    currentContent.theme.secondary_color = document.getElementById('secondary_color').value;
    currentContent.theme.bg_color = document.getElementById('bg_color').value;
    currentContent.theme.font_signature = document.getElementById('font_signature').value;
    currentContent.theme.font_heading = document.getElementById('font_heading').value;
    currentContent.theme.font_body = document.getElementById('font_body').value;

    fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentContent)
    })
        .then(res => res.json())
        .then(() => alert('Changes Saved!'))
        .catch(err => alert('Error saving'));
}

function uploadFile(file, callback) {
    const formData = new FormData();
    formData.append('image', file); // 'image' key is used by backend multer, but it accepts any file

    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => callback(data.path))
        .catch(err => alert('Upload failed'));
}

function uploadMusic() {
    const fileInput = document.getElementById('music_upload');
    const file = fileInput.files[0];
    if (!file) return;

    uploadFile(file, (path) => {
        currentContent.hero.music = path;
        document.getElementById('music_preview').src = path;
    });
}

function uploadCouplePhoto(type) {
    const fileInput = document.getElementById(type + '_upload');
    const file = fileInput.files[0];
    if (!file) return;

    uploadFile(file, (path) => {
        // Save to content object right away so it persists on 'Save Changes'
        if (type === 'groom') currentContent.couple.groom_img = path;
        if (type === 'bride') currentContent.couple.bride_img = path;

        // Update Preview
        document.getElementById(type + '_preview').src = path;
    });
}

function addToGallery() {
    const fileInput = document.getElementById('galleryUpload');
    const file = fileInput.files[0];
    if (!file) return;

    uploadFile(file, (path) => {
        currentContent.gallery.push(path);
        saveContent();
        // Clear input
        fileInput.value = '';
    });
}

function deleteFromGallery(index) {
    if (confirm('Delete this photo?')) {
        currentContent.gallery.splice(index, 1);
        saveContent();
    }
}

// --- Guest Management ---
function fetchGuests() {
    fetch('/api/guests')
        .then(res => res.json())
        .then(data => {
            renderGuests(data);
        });
}

function renderGuests(guests) {
    const tbody = document.getElementById('guestListTable');
    tbody.innerHTML = '';

    guests.forEach((guest, index) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid #eee";

        // Generate Link
        const inviteLink = `${window.location.origin}?to=${encodeURIComponent(guest.name)}`;

        // WhatsApp Message
        const message = `Halo ${guest.name},\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan kami.\nKlik link berikut untuk membuka undangan:\n${inviteLink}\n\nTerima kasih.`;
        const waLink = `https://wa.me/${guest.phone}?text=${encodeURIComponent(message)}`;

        tr.innerHTML = `
            <td style="padding: 10px;">${guest.name}</td>
            <td style="padding: 10px;">${guest.phone}</td>
            <td style="padding: 10px;">
                <a href="${inviteLink}" target="_blank" style="margin-right: 10px; color: #1abc9c; text-decoration: none;"><i class="fas fa-link"></i> Link</a>
                <a href="${waLink}" target="_blank" style="margin-right: 10px; color: #2ecc71; text-decoration: none;"><i class="fab fa-whatsapp"></i> Kirim WA</a>
                <button onclick="deleteGuest(${index})" style="background: red; color: white; border: none; padding: 5px 10px; font-size: 12px; cursor: pointer; border-radius: 4px;"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ... (existing guest functions) ...

function deleteGuest(index) {
    if (confirm('Are you sure?')) {
        fetch(`/api/guests/${index}`, { method: 'DELETE' })
            .then(() => fetchGuests());
    }
}

// --- RSVP Data ---
function fetchRSVPData() {
    fetch('/api/rsvp_data')
        .then(res => res.json())
        .then(data => {
            renderRSVP(data);
        });
}

function renderRSVP(data) {
    const tbody = document.getElementById('rsvpTableBody');
    tbody.innerHTML = '';

    // Reverse to show newest first
    data.slice().reverse().forEach(item => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid #eee";

        const dateStr = new Date(item.date).toLocaleString('id-ID');
        const statusColor = item.status === 'Hadir' ? 'green' : (item.status === 'Tidak Hadir' ? 'red' : 'orange');

        tr.innerHTML = `
            <td style="padding: 10px;">${item.name}</td>
            <td style="padding: 10px; color: ${statusColor}; font-weight: bold;">${item.status}</td>
            <td style="padding: 10px;">${item.count}</td>
            <td style="padding: 10px; font-style: italic; color: #555;">${item.message}</td>
            <td style="padding: 10px; font-size: 12px; color: #888;">${dateStr}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Additional init call
if (localStorage.getItem('token')) {
    fetchGuests();
    fetchRSVPData();
}

// Theme Color Sync listeners
document.querySelectorAll('input[type="color"]').forEach(input => {
    input.addEventListener('input', (e) => {
        const textInputId = e.target.id + '_text';
        const textInput = document.getElementById(textInputId);
        if (textInput) textInput.value = e.target.value;
    });
});
