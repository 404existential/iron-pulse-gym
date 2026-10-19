/**
 * PULSE FITNESS // Minimal Interactive Physics Engine
 * Multi-Dumbbell Cursor Repulsion & Clean Site Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPushableDumbbells();
  initContactModal();
});

/* ==========================================================================
   1. MINIMAL NAVBAR
   ========================================================================== */
function initNavbar() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileMenuClose');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  }
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE SMALL DUMBBELLS CURSOR REPULSION PHYSICS
   ========================================================================== */
function initPushableDumbbells() {
  const canvas = document.getElementById('dumbbellsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

  // High DPI
  const dpr = window.devicePixelRatio || 1;
  const resizeCanvas = () => {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse tracking
  let mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0, isHovering: false };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.isHovering = true;
      const dx = curX - mouse.prevX;
      const dy = curY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = curX;
      mouse.y = curY;
    } else {
      mouse.isHovering = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.isHovering = true;
    }
  }, { passive: true });

  // Click shockwave
  window.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      dumbbells.forEach(d => {
        const dx = d.x - clickX;
        const dy = d.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 260) {
          const force = (1 - dist / 260) * 22;
          d.vx += (dx / (dist || 1)) * force;
          d.vy += (dy / (dist || 1)) * force;
          d.vRot += (Math.random() - 0.5) * 0.4;
        }
      });
    }
  });

  // Spawn Dumbbell Instances
  const count = width < 768 ? 20 : 36;
  const dumbbells = [];

  class DumbbellParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      // Spawn within or just off screen
      if (initial) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      } else {
        // Spawn from random border
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { this.x = Math.random() * width; this.y = -40; }
        else if (side === 1) { this.x = width + 40; this.y = Math.random() * height; }
        else if (side === 2) { this.x = Math.random() * width; this.y = height + 40; }
        else { this.x = -40; this.y = Math.random() * height; }
      }

      this.length = 24 + Math.random() * 22; // 24px - 46px length
      this.plateRadius = this.length * 0.38;
      this.handleRadius = this.length * 0.08;

      // Base ambient drifting speed (slow & floating)
      this.baseVx = (Math.random() - 0.5) * 0.6;
      this.baseVy = (Math.random() - 0.5) * 0.6;
      this.vx = this.baseVx;
      this.vy = this.baseVy;

      this.angle = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.02;

      this.weightKg = [5, 10, 15, 20, 25][Math.floor(Math.random() * 5)];
      this.colorTone = Math.random() > 0.4 ? 'silver' : 'gold';
    }

    update() {
      // Repulsion from cursor
      if (mouse.x > -1000) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushRadius = 140; // Push field radius around cursor

        if (dist < pushRadius && dist > 1) {
          // Strong exponential push force
          const intensity = Math.pow(1 - dist / pushRadius, 2);
          const pushForce = intensity * 12 + Math.min(mouse.speed * 0.15, 8);

          this.vx += (dx / dist) * pushForce;
          this.vy += (dy / dist) * pushForce;
          this.vRot += (Math.random() - 0.5) * 0.25;
        }
      }

      // Air resistance / friction damping
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.vRot *= 0.96;

      // Re-apply subtle ambient drift
      this.x += this.vx + this.baseVx;
      this.y += this.vy + this.baseVy;
      this.angle += this.vRot;

      // If pushed completely out of screen bounds by cursor, respawn smoothly
      const margin = 80;
      if (this.x < -margin || this.x > width + margin || this.y < -margin || this.y > height + margin) {
        this.reset(false);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const halfLen = this.length / 2;
      const pRad = this.plateRadius;
      const pThick = this.length * 0.16;

      // 1. Central Knurled Steel Handle
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.roundRect(-halfLen, -this.handleRadius, this.length, this.handleRadius * 2, 2);
      ctx.fill();

      // Grip shine highlight
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-halfLen + 4, -this.handleRadius * 0.4, this.length - 8, this.handleRadius * 0.7);

      // 2. Left Plate
      drawPlate(ctx, -halfLen, pRad, pThick, this.colorTone, this.weightKg);

      // 3. Right Plate
      drawPlate(ctx, halfLen - pThick, pRad, pThick, this.colorTone, this.weightKg);

      ctx.restore();
    }
  }

  function drawPlate(ctx, x, radius, thickness, tone, kg) {
    // Plate outer border & body
    ctx.fillStyle = '#1e222d';
    ctx.beginPath();
    ctx.roundRect(x, -radius, thickness, radius * 2, 3);
    ctx.fill();

    // Metallic Rim / Accent
    ctx.strokeStyle = tone === 'gold' ? '#f59e0b' : '#64748b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Center hub detail
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(x + thickness / 2, 0, radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Initialize particles
  for (let i = 0; i < count; i++) {
    dumbbells.push(new DumbbellParticle());
  }

  // Animation Loop
  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    dumbbells.forEach(d => {
      d.update();
      d.draw(ctx);
    });

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

/* ==========================================================================
   3. CLEAN INQUIRY MODAL & WHATSAPP
   ========================================================================== */
function initContactModal() {
  const modal = document.getElementById('contactModal');
  const openBtns = document.querySelectorAll('.trigger-modal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const form = document.getElementById('contactForm');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value || 'Member';
      const phone = document.getElementById('userPhone').value || '';
      const plan = document.getElementById('userPlan').value || 'Gym Membership';

      if (modal) modal.classList.remove('active');

      // Direct WhatsApp redirect
      const message = encodeURIComponent(`Hi Pulse Fitness! My name is ${name} (${phone}). I would like to inquire about the ${plan} and schedule a free trial walkthrough.`);
      window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
      form.reset();
    });
  }
}
