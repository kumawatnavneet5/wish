
// ========================================
// 1. LOADING SCREEN
// ========================================

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hide");
    }, 1500);
});


// ========================================
// 2. GOLDEN PARTICLE ANIMATION
// ========================================

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
let width = 0;
let height = 0;

const mouse = {
    x: -1000,
    y: -1000
};

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
}

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.7 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.7 + 0.2;
        this.phase = Math.random() * Math.PI * 2;
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.phase) * 0.15;
        this.phase += 0.01;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100 && distance > 0) {
            this.x += (dx / distance) * 0.7;
            this.y += (dy / distance) * 0.7;
        }

        if (this.y < -10) {
            this.reset();
        }

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
    }

    draw() {
        ctx.save();

        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "#ffd477";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ffb52f";

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function createParticles() {
    const count = Math.min(
        Math.floor((width * height) / 9000),
        150
    );

    particles = Array.from(
        { length: count },
        () => new Particle()
    );
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("pointermove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("pointerleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

resizeCanvas();
animateParticles();


// ========================================
// 3. SCROLL REVEAL ANIMATION
// ========================================

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    observer.observe(element);
});


// ========================================
// 4. 3D TILT EFFECT ON WISH CARDS
// ========================================

const cards = document.querySelectorAll(".wish-card");

cards.forEach((card) => {

    card.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (centerY - y) / 18;
        const rotateY = (x - centerX) / 18;

        card.style.transform =
            `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("pointerleave", () => {
        card.style.transform = "";
    });

});


// ========================================
// 5. SURPRISE POPUP
// ========================================

const surpriseBtn = document.getElementById("surpriseBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const popupOkay = document.getElementById("popupOkay");

function openSurprise() {
    popup.classList.add("active");
    launchFireworks();
}

function hideSurprise() {
    popup.classList.remove("active");
}

surpriseBtn.addEventListener("click", openSurprise);
closePopup.addEventListener("click", hideSurprise);
popupOkay.addEventListener("click", hideSurprise);

popup.addEventListener("click", (event) => {
    if (event.target === popup) {
        hideSurprise();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hideSurprise();
    }
});


// ========================================
// 6. GOLDEN FIREWORKS
// ========================================

let fireworks = [];
let fireworkAnimation = false;

class FireworkParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.life = 1;
        this.size = Math.random() * 2 + 1;
        this.gravity = 0.045;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vy += this.gravity;

        this.life -= 0.014;
    }

    draw() {
        ctx.save();

        ctx.globalAlpha = Math.max(this.life, 0);
        ctx.fillStyle = "#ffd77b";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffb62f";

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function createFirework(x, y) {
    for (let i = 0; i < 55; i++) {
        fireworks.push(new FireworkParticle(x, y));
    }
}

function launchFireworks() {
    const positions = [
        [width * 0.2, height * 0.3],
        [width * 0.8, height * 0.25],
        [width * 0.5, height * 0.2],
        [width * 0.35, height * 0.5],
        [width * 0.7, height * 0.45]
    ];

    positions.forEach(([x, y], index) => {
        setTimeout(() => {
            createFirework(x, y);
        }, index * 250);
    });

    if (!fireworkAnimation) {
        fireworkAnimation = true;
        animateFireworks();
    }
}

function animateFireworks() {
    // Preserve the existing background particle canvas.
    // Fireworks are drawn in a separate transparent overlay.
    fireworks.forEach(particle => {
        particle.update();
        particle.draw();
    });

    fireworks = fireworks.filter(
        particle => particle.life > 0
    );

    if (fireworks.length > 0) {
        requestAnimationFrame(animateFireworks);
    } else {
        fireworkAnimation = false;
    }
}


// ========================================
// 7. FOOTER YEAR
// ========================================

const footerYear = document.querySelector("footer span");

if (footerYear) {
    footerYear.textContent =
        `HAPPY DHANTERAS • ${new Date().getFullYear()}`;
}
