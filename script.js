document.addEventListener('DOMContentLoaded', () => {

    
    const canvas = document.getElementById('particleCanvas');
    const ctx    = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width  = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * canvas.width;
            this.y  = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.baseR = Math.random() * 2 + 0.5;
            this.r = this.baseR;
            this.alpha = Math.random() * 0.5 + 0.1;
            const hue = 240 + Math.random() * 80;
            this.color = `hsla(${hue}, 70%, 65%, ${this.alpha})`;
            this.glowColor = `hsla(${hue}, 80%, 70%, 0.3)`;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                    this.r = this.baseR + force * 2;
                } else {
                    this.r += (this.baseR - this.r) * 0.05;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            if (this.r > this.baseR) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = this.glowColor;
                ctx.fill();
            }
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 7000), 160);
        particles = Array.from({ length: count }, () => new Particle());
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    const opacity = 0.1 * (1 - dist / 130);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(124, 58, 237, ${opacity})`);
                    gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    
    const cursorGlow = document.getElementById('cursorGlow');
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top  = e.clientY + 'px';
        });
    }

    
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        
        // Scroll progress bar
        const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / scrollTotal) * 100;
        document.getElementById('scrollProgress').style.width = scrolled + '%';
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    
    const animItems = document.querySelectorAll('.animate-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement
                    ? [...entry.target.parentElement.children]
                    : [];
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${Math.min(idx * 0.1, 0.5)}s`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animItems.forEach(item => observer.observe(item));

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    
    const sections = document.querySelectorAll('.section');

    function updateActiveNav() {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 140;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    
    function animateCounter(el, target, duration = 2000) {
        let start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'), 10);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // Scroll Reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-item').forEach(el => revealObserver.observe(el));

    
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('.social-icon, .btn-primary, .btn-outline, .btn-sm, .footer-logo');
    if (window.innerWidth > 768) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Card Spotlights (Project, Achievement, Certificate)
    const spotlights = document.querySelectorAll('.project-card, .achievement-card, .certificate-card, .training-card');
    spotlights.forEach(card => {
        // Ensure the card has a spotlight element if it's missing (proactive check)
        if (!card.querySelector('.card-spotlight')) {
            const spotlight = document.createElement('div');
            spotlight.className = 'card-spotlight';
            card.appendChild(spotlight);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name    = form.querySelector('#name').value.trim();
        const email   = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        const mailtoLink = `mailto:arnavkhandelwal.143@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Email Client Opened!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            showFormMessage('Your email client has been opened with the message. Please hit Send!', 'success');

            setTimeout(() => {
                form.reset();
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                btn.disabled = false;
                btn.style.background = '';
            }, 4000);
        }, 500);
    });

    function showFormMessage(msg, type) {

        const existing = form.querySelector('.form-message');
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.className = `form-message form-message-${type}`;
        el.textContent = msg;
        el.style.cssText = `
            padding: 12px 16px;
            border-radius: 8px;
            font-size: .88rem;
            font-weight: 500;
            background: ${type === 'error' ? 'rgba(239,68,68,.1)' : 'rgba(16,185,129,.1)'};
            color: ${type === 'error' ? '#ef4444' : '#10b981'};
            border: 1px solid ${type === 'error' ? 'rgba(239,68,68,.2)' : 'rgba(16,185,129,.2)'};
            margin-bottom: 8px;
            animation: fadeIn .3s ease;
        `;
        form.insertBefore(el, form.firstChild);
        setTimeout(() => el.remove(), 4000);
    }

    
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    
    const typingTexts = [
        'Data Science Enthusiast',
        'Problem Solver',
        'AI Explorer',
        'Full Stack Learner'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingEl = document.querySelector('.typing-text');

    function typeEffect() {
        if (!typingEl) return;

        const currentText = typingTexts[textIndex];
        const speed = isDeleting ? 40 : 80;

        if (!isDeleting) {
            typingEl.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                setTimeout(() => { isDeleting = true; typeEffect(); }, 2000);
                return;
            }
        } else {
            typingEl.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingTexts.length;
            }
        }

        setTimeout(typeEffect, speed);
    }

    setTimeout(typeEffect, 2000);

    
    const orbs = document.querySelectorAll('.hero-orb');
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 8;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
});
