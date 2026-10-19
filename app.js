/**
 * RAW. // HIGH PERFORMANCE STUDIO
 * Preloader (0.66s) & Continuous Toroidal Wrap Physics Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initFloatingElementsPhysics();
  initBookingModal();
});

/* ==========================================================================
   1. PRELOADER (EXACTLY 0.66 SEC)
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // 0.66 seconds = 660 milliseconds
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 660);
}

/* ==========================================================================
   2. TOP NAVIGATION
   ========================================================================== */
function initNavbar() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileMenuClose');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

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
   3. FLOATING DUMBBELLS & SPHERES WITH SEAMLESS 4-WAY SCREEN WRAPPING
   ========================================================================== */
function initFloatingElementsPhysics() {
  const canvas = document.getElementById('dumbbellCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

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

  // Mouse Tracking
  let mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const dx = curX - mouse.prevX;
      const dy = curY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = curX;
      mouse.y = curY;
    } else {
      mouse.x = -9999;
      mouse.y = -9999;
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.speed = 10;
    }
  }, { passive: true });

  // Click shockwave
  window.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      items.forEach(item => {
        const dx = item.x - clickX;
        const dy = item.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 280) {
          const force = (1 - dist / 280) * 26;
          item.vx += (dx / (dist || 1)) * force;
          item.vy += (dy / (dist || 1)) * force;
          item.vRot += (Math.random() - 0.5) * 0.4;
        }
      });
    }
  });

  const items = [];
  const numDumbbells = width < 768 ? 16 : 28;
  const numSpheres = width < 768 ? 10 : 18;

  class FloatingItem {
    constructor(type) {
      this.type = type; // 'dumbbell' or 'sphere'
      this.x = Math.random() * width;
      this.y = Math.random() * height;

      // Depth scaling (foreground vs background)
      this.depth = 0.65 + Math.random() * 0.75; // 0.65 to 1.4
      this.size = this.type === 'dumbbell' ? (28 + Math.random() * 22) * this.depth : (8 + Math.random() * 12) * this.depth;

      // Ambient drift velocity
      this.baseVx = (Math.random() - 0.5) * 0.35 * this.depth;
      this.baseVy = (Math.random() - 0.5) * 0.35 * this.depth;
      this.vx = this.baseVx;
      this.vy = this.baseVy;

      this.angle = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.015;
      this.bobOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      // Repulsion force from cursor
      if (mouse.x > -1000) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushRadius = 150 * this.depth;

        if (dist < pushRadius && dist > 1) {
          const intensity = Math.pow(1 - dist / pushRadius, 2);
          const pushForce = intensity * 15 + Math.min(mouse.speed * 0.22, 10);

          this.vx += (dx / dist) * pushForce;
          this.vy += (dy / dist) * pushForce;
          this.vRot += (Math.random() - 0.5) * 0.25;
        }
      }

      // Physics drag / friction
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.vRot *= 0.96;

      // Subtle natural bobbing
      const bobY = Math.sin(time * 1.5 + this.bobOffset) * 0.25;

      this.x += this.vx + this.baseVx;
      this.y += this.vy + this.baseVy + bobY;
      this.angle += this.vRot;

      // ======================================================================
      // 4-WAY SEAMLESS TOROIDAL SCREEN-WRAP
      // When removing at the left, it immediately comes from the right, and
      // vice versa for top and bottom.
      // ======================================================================
      const margin = 35;
      if (this.x < -margin) {
        this.x = width + margin;
      } else if (this.x > width + margin) {
        this.x = -margin;
      }

      if (this.y < -margin) {
        this.y = height + margin;
      } else if (this.y > height + margin) {
        this.y = -margin;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Realistic soft drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 14 * this.depth;
      ctx.shadowOffsetY = 8 * this.depth;

      if (this.type === 'dumbbell') {
        ctx.rotate(this.angle);
        drawRealisticDumbbell(ctx, this.size, this.depth);
      } else {
        drawGoldenSphere(ctx, this.size);
      }

      ctx.restore();
    }
  }

  // Draw Realistic 3D Cast-Iron Dumbbell
  function drawRealisticDumbbell(ctx, length, depth) {
    const halfLen = length / 2;
    const plateRadius = length * 0.42;
    const plateWidth = length * 0.16;
    const handleRadius = length * 0.085;

    // Steel Knurled Center Handle
    const handleGrad = ctx.createLinearGradient(0, -handleRadius, 0, handleRadius);
    handleGrad.addColorStop(0, '#64748b');
    handleGrad.addColorStop(0.35, '#cbd5e1');
    handleGrad.addColorStop(0.5, '#ffffff'); // bright chrome shine
    handleGrad.addColorStop(0.7, '#94a3b8');
    handleGrad.addColorStop(1, '#334155');

    ctx.fillStyle = handleGrad;
    ctx.beginPath();
    ctx.roundRect(-halfLen, -handleRadius, length, handleRadius * 2, 2);
    ctx.fill();

    // Cast Iron Plates (Left & Right)
    drawPlate(ctx, -halfLen, plateRadius, plateWidth);
    drawPlate(ctx, halfLen - plateWidth, plateRadius, plateWidth);
  }

  function drawPlate(ctx, x, radius, width) {
    // Plate outer dark cylinder
    const plateGrad = ctx.createLinearGradient(0, -radius, 0, radius);
    plateGrad.addColorStop(0, '#1c1f28');
    plateGrad.addColorStop(0.3, '#2a2f3d');
    plateGrad.addColorStop(0.7, '#1e222c');
    plateGrad.addColorStop(1, '#0e1015');

    ctx.fillStyle = plateGrad;
    ctx.beginPath();
    ctx.roundRect(x, -radius, width, radius * 2, 4);
    ctx.fill();

    // Subtle beveled highlight rim
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Outer face gloss accent
    ctx.fillStyle = 'rgba(212, 163, 115, 0.45)';
    ctx.fillRect(x + width * 0.4, -radius * 0.35, width * 0.2, radius * 0.7);
  }

  // Draw Glossy Golden Sphere (Barbell Collar Bead)
  function drawGoldenSphere(ctx, radius) {
    const sphereGrad = ctx.createRadialGradient(
      -radius * 0.35, -radius * 0.35, radius * 0.05,
      0, 0, radius
    );
    sphereGrad.addColorStop(0, '#fff4e6');   // hot specular highlight
    sphereGrad.addColorStop(0.2, '#f6c77d'); // bright gold
    sphereGrad.addColorStop(0.5, '#d4a373'); // warm amber bronze
    sphereGrad.addColorStop(0.85, '#99582a'); // rich deep bronze
    sphereGrad.addColorStop(1, '#432818');   // ambient shadow edge

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Spawn instances
  for (let i = 0; i < numDumbbells; i++) {
    items.push(new FloatingItem('dumbbell'));
  }
  for (let i = 0; i < numSpheres; i++) {
    items.push(new FloatingItem('sphere'));
  }

  items.sort((a, b) => a.depth - b.depth);

  // Animation Loop
  let time = 0;
  const loop = () => {
    ctx.clearRect(0, 0, width, height);
    time += 0.02;

    items.forEach(item => {
      item.update(time);
      item.draw(ctx);
    });

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

/* ==========================================================================
   4. BOOKING MODAL & WHATSAPP
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.trigger-modal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const form = document.getElementById('bookingForm');

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
      const name = document.getElementById('bookName').value || 'Member';
      const phone = document.getElementById('bookPhone').value || '';
      const plan = document.getElementById('bookPlan').value || 'Membership';

      if (modal) modal.classList.remove('active');

      const text = encodeURIComponent(`Hi RAW! My name is ${name} (${phone}). I would like to book a spot / inquire about the ${plan}.`);
      window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
      form.reset();
    });
  }
}
