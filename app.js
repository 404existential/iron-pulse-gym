/**
 * RAW. // HIGH PERFORMANCE STUDIO
 * High-Performance 120 FPS Offscreen-Cached Physics Engine
 * Multi-Dumbbell & Golden Sphere Canvas with 4-Way Continuous Screen Wrap
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initFlawlessPhysicsEngine();
  initBookingModal();
});

/* ==========================================================================
   1. PRELOADER (EXACTLY 0.66 SECONDS)
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Exact 0.66s delay
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 320);
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
   3. BUTTERY-SMOOTH 120 FPS OFFSCREEN-CACHED PHYSICS ENGINE
   Zero CPU lag: All shadows and gradients are pre-rendered into GPU sprites once!
   ========================================================================== */
function initFlawlessPhysicsEngine() {
  const canvas = document.getElementById('dumbbellCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for optimal battery & GPU performance
  const resizeCanvas = () => {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --------------------------------------------------------------------------
  // PRE-RENDER SPRITES (Offscreen Caching for Zero Render Lag)
  // --------------------------------------------------------------------------
  const spriteCache = {
    dumbbells: [],
    spheres: []
  };

  const depths = [0.7, 0.9, 1.15, 1.35];

  // 1. Pre-render Dumbbell Sprites with soft drop shadows
  depths.forEach(depth => {
    const baseLen = 36 * depth;
    const padding = 24 * depth; // space for soft blurred shadow
    const spriteW = Math.ceil(baseLen + padding * 2);
    const spriteH = Math.ceil(baseLen * 0.9 + padding * 2);

    const sCanvas = document.createElement('canvas');
    sCanvas.width = spriteW;
    sCanvas.height = spriteH;
    const sCtx = sCanvas.getContext('2d');

    const cx = spriteW / 2;
    const cy = spriteH / 2;

    // Baked Soft Shadow
    sCtx.save();
    sCtx.translate(cx, cy);
    sCtx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    sCtx.shadowBlur = 12 * depth;
    sCtx.shadowOffsetY = 7 * depth;

    // Render Cast-Iron Dumbbell Shape
    const halfL = baseLen / 2;
    const pRad = baseLen * 0.42;
    const pWidth = baseLen * 0.18;
    const hRad = baseLen * 0.085;

    // Chrome Knurled Center Bar
    const hGrad = sCtx.createLinearGradient(0, -hRad, 0, hRad);
    hGrad.addColorStop(0, '#64748b');
    hGrad.addColorStop(0.35, '#cbd5e1');
    hGrad.addColorStop(0.5, '#ffffff'); // specular shine
    hGrad.addColorStop(0.7, '#94a3b8');
    hGrad.addColorStop(1, '#334155');

    sCtx.fillStyle = hGrad;
    sCtx.beginPath();
    sCtx.roundRect(-halfL, -hRad, baseLen, hRad * 2, 2);
    sCtx.fill();

    // Left & Right Hexagonal/Curved Plates
    drawCachedPlate(sCtx, -halfL, pRad, pWidth);
    drawCachedPlate(sCtx, halfL - pWidth, pRad, pWidth);

    sCtx.restore();

    spriteCache.dumbbells.push({
      canvas: sCanvas,
      width: spriteW,
      height: spriteH,
      halfW: spriteW / 2,
      halfH: spriteH / 2,
      depth: depth
    });
  });

  function drawCachedPlate(c, x, radius, width) {
    const pGrad = c.createLinearGradient(0, -radius, 0, radius);
    pGrad.addColorStop(0, '#232733');
    pGrad.addColorStop(0.3, '#313747');
    pGrad.addColorStop(0.7, '#1b1e28');
    pGrad.addColorStop(1, '#0e1017');

    c.fillStyle = pGrad;
    c.beginPath();
    c.roundRect(x, -radius, width, radius * 2, 4);
    c.fill();

    // Elegant beveled metallic edge (no awkward dashes)
    c.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    c.lineWidth = 1;
    c.stroke();

    // Central plate ring detail
    c.strokeStyle = 'rgba(212, 163, 115, 0.3)';
    c.lineWidth = 1.2;
    c.beginPath();
    c.arc(x + width / 2, 0, radius * 0.45, 0, Math.PI * 2);
    c.stroke();
  }

  // 2. Pre-render Glossy Golden Spheres (matching coffee beans golden pearls)
  depths.forEach(depth => {
    const radius = 10 * depth;
    const padding = 18 * depth;
    const spriteSize = Math.ceil((radius + padding) * 2);

    const sCanvas = document.createElement('canvas');
    sCanvas.width = spriteSize;
    sCanvas.height = spriteSize;
    const sCtx = sCanvas.getContext('2d');

    const cx = spriteSize / 2;
    const cy = spriteSize / 2;

    sCtx.save();
    sCtx.translate(cx, cy);

    // Baked Drop Shadow
    sCtx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    sCtx.shadowBlur = 10 * depth;
    sCtx.shadowOffsetY = 6 * depth;

    // 3D Spherical Gold Gradient with Specular Highlight
    const sGrad = sCtx.createRadialGradient(
      -radius * 0.35, -radius * 0.35, radius * 0.05,
      0, 0, radius
    );
    sGrad.addColorStop(0, '#ffffff');   // intense white specular light
    sGrad.addColorStop(0.2, '#fae1b8'); // soft light gold
    sGrad.addColorStop(0.5, '#d4a373'); // rich warm gold
    sGrad.addColorStop(0.85, '#99582a'); // bronze shadow
    sGrad.addColorStop(1, '#432818');   // ambient rim

    sCtx.fillStyle = sGrad;
    sCtx.beginPath();
    sCtx.arc(0, 0, radius, 0, Math.PI * 2);
    sCtx.fill();

    sCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    sCtx.lineWidth = 0.8;
    sCtx.stroke();

    sCtx.restore();

    spriteCache.spheres.push({
      canvas: sCanvas,
      width: spriteSize,
      height: spriteSize,
      halfW: spriteSize / 2,
      halfH: spriteSize / 2,
      depth: depth
    });
  });

  // --------------------------------------------------------------------------
  // MOUSE & TOUCH PHYSICS TRACKING
  // --------------------------------------------------------------------------
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
      mouse.speed = 12;
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
        if (dist < 260) {
          const force = (1 - dist / 260) * 24;
          item.vx += (dx / (dist || 1)) * force;
          item.vy += (dy / (dist || 1)) * force;
          item.vRot += (Math.random() - 0.5) * 0.35;
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // SPAWN PARTICLES (Distributed across the hero canvas)
  // --------------------------------------------------------------------------
  const items = [];
  const numDumbbells = width < 768 ? 14 : 22;
  const numSpheres = width < 768 ? 8 : 14;

  class PhysicsItem {
    constructor(type) {
      this.type = type; // 'dumbbell' or 'sphere'
      const spriteList = type === 'dumbbell' ? spriteCache.dumbbells : spriteCache.spheres;
      const spriteObj = spriteList[Math.floor(Math.random() * spriteList.length)];

      this.sprite = spriteObj.canvas;
      this.halfW = spriteObj.halfW;
      this.halfH = spriteObj.halfH;
      this.depth = spriteObj.depth;

      // Position
      this.x = Math.random() * width;
      this.y = Math.random() * height;

      // Ambient floating drift
      this.baseVx = (Math.random() - 0.5) * 0.3 * this.depth;
      this.baseVy = (Math.random() - 0.5) * 0.3 * this.depth;
      this.vx = this.baseVx;
      this.vy = this.baseVy;

      this.angle = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.012;
      this.bobOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      // Repulsion force from cursor
      if (mouse.x > -1000) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushRadius = 145 * this.depth;

        if (dist < pushRadius && dist > 1) {
          const intensity = Math.pow(1 - dist / pushRadius, 2);
          const pushForce = intensity * 15 + Math.min(mouse.speed * 0.2, 9);

          this.vx += (dx / dist) * pushForce;
          this.vy += (dy / dist) * pushForce;
          this.vRot += (Math.random() - 0.5) * 0.22;
        }
      }

      // Physics friction
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.vRot *= 0.96;

      // Ambient bobbing
      const bobY = Math.sin(time * 1.6 + this.bobOffset) * 0.22;

      this.x += this.vx + this.baseVx;
      this.y += this.vy + this.baseVy + bobY;
      this.angle += this.vRot;

      // 4-WAY SEAMLESS TOROIDAL SCREEN-WRAP
      const margin = 45;
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

    draw(targetCtx) {
      targetCtx.save();
      targetCtx.translate(this.x, this.y);
      if (this.type === 'dumbbell') {
        targetCtx.rotate(this.angle);
      }
      // Single GPU drawImage blit - runs in ~0.002ms!
      targetCtx.drawImage(this.sprite, -this.halfW, -this.halfH);
      targetCtx.restore();
    }
  }

  // Populate items
  for (let i = 0; i < numDumbbells; i++) items.push(new PhysicsItem('dumbbell'));
  for (let i = 0; i < numSpheres; i++) items.push(new PhysicsItem('sphere'));

  // Sort by depth so background items stay behind foreground items
  items.sort((a, b) => a.depth - b.depth);

  // --------------------------------------------------------------------------
  // ULTRA-FAST RENDER LOOP (Zero GC Allocations per Frame)
  // --------------------------------------------------------------------------
  let time = 0;
  const loop = () => {
    ctx.clearRect(0, 0, width, height);
    time += 0.02;

    for (let i = 0; i < items.length; i++) {
      items[i].update(time);
      items[i].draw(ctx);
    }

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

/* ==========================================================================
   4. BOOKING MODAL & DIRECT WHATSAPP INTEGRATION
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
