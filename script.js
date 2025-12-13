document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false
    });

    // Content Loading
    fetch('/api/content')
        .then(res => res.json())
        .then(data => {
            loadContent(data);
        })
        .catch(err => console.error("Could not load content, using defaults or failed.", err));

    function loadContent(data) {
        // Theme Application
        if (data.theme) {
            const root = document.documentElement;
            // Colors
            root.style.setProperty('--primary-color', data.theme.primary_color);
            root.style.setProperty('--secondary-color', data.theme.secondary_color);
            root.style.setProperty('--bg-color', data.theme.bg_color);

            // Fonts
            root.style.setProperty('--font-signature', `'${data.theme.font_signature}', cursive`);
            root.style.setProperty('--font-heading', `'${data.theme.font_heading}', serif`);
            root.style.setProperty('--font-body', `'${data.theme.font_body}', sans-serif`);

            // Load Google Fonts
            const fonts = [
                data.theme.font_signature,
                data.theme.font_heading,
                data.theme.font_body
            ];
            const uniqueFonts = [...new Set(fonts)];
            const fontQuery = uniqueFonts.map(font =>
                `family=${font.replace(/ /g, '+')}:wght@400;600;700`
            ).join('&');

            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        // Events - use explicit IDs for safety
        if (data.event) {
            // Akad
            if (data.event.akad_time) {
                const el = document.getElementById('txt_akad_time');
                if (el) el.innerText = data.event.akad_time;
            }
            if (data.event.akad_location) {
                const el = document.getElementById('txt_akad_location');
                if (el) el.innerText = data.event.akad_location;
            }
            if (data.event.akad_address) {
                const el = document.getElementById('txt_akad_address');
                if (el) el.innerText = data.event.akad_address;
            }
            if (data.event.akad_map_link) {
                const el = document.getElementById('btn_akad_map');
                if (el) el.href = data.event.akad_map_link;
            }

            // Resepsi
            if (data.event.resepsi_time) {
                const el = document.getElementById('txt_resepsi_time');
                if (el) el.innerText = data.event.resepsi_time;
            }
            if (data.event.resepsi_location) {
                const el = document.getElementById('txt_resepsi_location');
                if (el) el.innerText = data.event.resepsi_location;
            }
            if (data.event.resepsi_address) {
                const el = document.getElementById('txt_resepsi_address');
                if (el) el.innerText = data.event.resepsi_address;
            }
            if (data.event.resepsi_map_link) {
                const el = document.getElementById('btn_resepsi_map');
                if (el) el.href = data.event.resepsi_map_link;
            }

            // Gift Section
            if (data.rsvp) {
                // Bank
                if (data.rsvp.bank_name) {
                    const el = document.getElementById('bank_name_text');
                    if (el) el.innerText = data.rsvp.bank_name;
                }
                if (data.rsvp.account_number) {
                    const el = document.getElementById('account_number_text');
                    if (el) el.innerText = data.rsvp.account_number;
                }
                if (data.rsvp.account_name) {
                    const el = document.getElementById('account_owner_text');
                    if (el) el.innerText = 'a.n ' + data.rsvp.account_name;
                }

                // E-Wallet
                if (data.rsvp.ewallet_name) {
                    const el = document.getElementById('ewallet_name_text');
                    if (el) el.innerText = data.rsvp.ewallet_name;
                }
                if (data.rsvp.ewallet_number) {
                    const el = document.getElementById('ewallet_number_text');
                    if (el) el.innerText = data.rsvp.ewallet_number;
                }
                if (data.rsvp.ewallet_owner) {
                    const el = document.getElementById('ewallet_owner_text');
                    if (el) el.innerText = 'a.n ' + data.rsvp.ewallet_owner;
                }
            }
        }
        // Hero
        if (data.hero) {
            document.querySelector('.title').textContent = data.hero.title;
            document.querySelector('.subtitle').textContent = data.hero.subtitle;
            document.querySelector('.date').textContent = data.hero.date;

            // Cover Title
            document.querySelector('.cover-content h1').textContent = data.hero.title;

            // Countdown
            startCountdown(data.hero.weddingDateIso);
        }

        // Couple
        if (data.couple) {
            const coupleCards = document.querySelectorAll('.couple-card');
            // Groom
            coupleCards[0].querySelector('h3').textContent = data.couple.groom_name;
            coupleCards[0].querySelector('p').textContent = data.couple.groom_parents;
            coupleCards[0].querySelector('img').src = data.couple.groom_img;

            // Bride
            coupleCards[1].querySelector('h3').textContent = data.couple.bride_name;
            coupleCards[1].querySelector('p').textContent = data.couple.bride_parents;
            coupleCards[1].querySelector('img').src = data.couple.bride_img;

            // Footer
            document.querySelector('footer h2').textContent = data.hero.title;
        }

        // Events
        if (data.event) {
            const events = document.querySelectorAll('.event-card');
            // Akad
            events[0].querySelector('.event-header h3').textContent = data.event.akad_title;
            // Simplified selector for demo: assuming structure is fixed
            // In a real app, use IDs for better targeting
        }

        // RSVP / Bank
        if (data.rsvp) {
            document.querySelector('.bank-card h3').textContent = data.rsvp.bank_name;
            document.querySelector('.account-number').textContent = data.rsvp.account_number;
            document.querySelectorAll('.bank-card p')[1].textContent = "a.n " + data.rsvp.account_name;
        }

        // Gallery
        const galleryGrid = document.querySelector('.gallery-grid');
        if (data.gallery) {
            galleryGrid.innerHTML = ''; // Clear existing static/placeholder items

            data.gallery.forEach((src, index) => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                // Add AOS data attributes dynamically
                div.setAttribute('data-aos', 'zoom-in');
                div.setAttribute('data-aos-delay', index * 100);

                const img = document.createElement('img');
                img.src = src;
                img.alt = 'Gallery Photo';

                div.appendChild(img);
                galleryGrid.appendChild(div);
            });

            // Refresh AOS to detect new elements
            setTimeout(() => AOS.refresh(), 100);
        }
    }

    // Get URL Parameters used for 'to' name
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        document.getElementById('guestName').textContent = guestName;
    }

    // Cover & Music Logic
    const openBtn = document.getElementById('openInvitation');
    const coverSection = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const musicControl = document.getElementById('music-control');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');

    let isPlaying = false;

    openBtn.addEventListener('click', () => {
        coverSection.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out';
        coverSection.style.transform = 'translateY(-100%)';
        coverSection.style.opacity = '0';

        setTimeout(() => {
            coverSection.classList.add('hidden');
            mainContent.classList.remove('hidden');
            musicControl.classList.remove('hidden');
            playMusic();

            // Re-trigger AOS layout
            AOS.refresh();
        }, 800);
    });

    function playMusic() {
        bgMusic.play().then(() => {
            isPlaying = true;
        }).catch(err => {
            console.log("Auto-play prevented");
            isPlaying = false;
            musicToggle.classList.remove('spin');
        });
    }

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('spin');
        } else {
            bgMusic.play();
            musicToggle.classList.add('spin');
        }
        isPlaying = !isPlaying;
    });

    function startCountdown(isoDate) {
        const weddingDate = new Date(isoDate).getTime();

        const countdownTimer = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = String(days).padStart(2, '0');
            document.getElementById("hours").innerText = String(hours).padStart(2, '0');
            document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
            document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

            if (distance < 0) {
                clearInterval(countdownTimer);
                document.querySelector('.countdown').innerHTML = "<p>The Wedding has started!</p>";
            }
        }, 1000);
    }

    // RSVP Form Submission
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const rsvpData = {
                name: document.getElementById('rsvp_name').value,
                status: document.getElementById('rsvp_status').value,
                count: document.getElementById('rsvp_count').value,
                message: document.getElementById('rsvp_message').value
            };

            fetch('/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rsvpData)
            })
                .then(res => res.json())
                .then(() => {
                    alert('Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.');
                    rsvpForm.reset();
                })
                .catch(() => alert('Terjadi kesalahan, coba lagi.'));
        });
    }

    // Copy Account Number Logic
    const btnCopy = document.getElementById('btn_copy_rekening');
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            const accNum = document.getElementById('account_number_text').innerText;
            navigator.clipboard.writeText(accNum).then(() => {
                const originalText = btnCopy.innerHTML;
                btnCopy.innerHTML = '<i class="fas fa-check"></i> Disalin!';
                setTimeout(() => {
                    btnCopy.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy', err);
                alert('Gagal menyalin, silakan salin manual.');
            });
        });
    }

    // Copy E-Wallet Logic
    const btnCopyEwallet = document.getElementById('btn_copy_ewallet');
    if (btnCopyEwallet) {
        btnCopyEwallet.addEventListener('click', () => {
            const ewalletNum = document.getElementById('ewallet_number_text').innerText;
            navigator.clipboard.writeText(ewalletNum).then(() => {
                const originalText = btnCopyEwallet.innerHTML;
                btnCopyEwallet.innerHTML = '<i class="fas fa-check"></i> Disalin!';
                setTimeout(() => {
                    btnCopyEwallet.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy', err);
                alert('Gagal menyalin, silakan salin manual.');
            });
        });
    }

    // Active Navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.bottom-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });
});
