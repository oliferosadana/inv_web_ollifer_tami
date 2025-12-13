# Undangan Digital (Wedding Invitation CMS)

A dynamic wedding invitation website with a built-in Content Management System (CMS) to manage bride/groom details, events, gallery, and RSVPs without touching the code.

## features

- **Frontend**: Responsive, Animated (AOS), and Themed design.
- **CMS**: Admin panel to edit text, upload photos, and manage guest lists.
- **Theme Config**: Customize colors and fonts directly from the admin panel.
- **RSVP**: Guest confirmation system with data stored in basic JSON storage.
- **Guest Management**: Generate unique invitation links for guests.
- **Docker Ready**: Includes Dockerfile and Compose setup for easy deployment.

## Prerequisites

- Node.js (v14 or higher)
- OR Docker & Docker Compose

## Installation & Running (Local)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Server**
   ```bash
   npm start
   ```

3. **Access the App**
   - **Invitation**: [http://localhost:3000](http://localhost:3000)
   - **Admin Panel**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

## Running with Docker

1. **Build and Run**
   ```bash
   docker-compose up -d --build
   ```

2. **Stop Container**
   ```bash
   docker-compose down
   ```

## Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

## Project Structure

- `server.js`: Express backend handling API and file serving.
- `content.json`: Database file storing all text, settings, and RSVP data.
- `assets/`: Images and uploaded files.
- `admin.html` / `admin.js`: CMS Interface.
- `index.html` / `script.js` / `style.css`: Main Invitation Frontend.

## Customization

You can customize the look and feel via the **Admin Panel > Theme Tab**, or manually edit `style.css`.
