/**
 * VAJRA IRON // THE MODERN AKHADA
 * Interactive Floating 3D Dumbbell Engine & Minimal Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFloatingDumbbell();
  initModalAndWhatsApp();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileMenuClose');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

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
   2. INTERACTIVE 3D FLOATING DUMBBELL CANVAS ENGINE
   ========================================================================== */
function initFloatingDumbbell() {
  const canvas = document.getElementById('dumbbellCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.clientWidth;
  let height = canvas.clientHeight;

  // High DPI resolution support
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

  // Dumbbell State & Physics
  let targetAngleX = 0;
  let targetAngleY = 0;
  let angleX = 0.15;
  let angleY = -0.3;
  let angularVelY = 0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let floatTime = 0;
  let currentWeight = 25; // 10, 25, 50 kg

  // Weight buttons
  const weightBtns = document.querySelectorAll('.weight-btn');
  weightBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      weightBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentWeight = parseInt(btn.getAttribute('data-weight'), 10) || 25;
      showToast(`⚡ Selected: ${currentWeight} KG Cast Iron Vajra Dumbbell`);
      // Add a quick spin on weight change
      angularVelY = 0.25;
    });
  });

  // Mouse & Touch Interaction
  const arena = document.querySelector('.hero-section');

  const onPointerMove = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (clientX - centerX) / (rect.width / 2);
    const deltaY = (clientY - centerY) / (rect.height / 2);

    if (isDragging) {
      const moveX = clientX - lastMouseX;
      angularVelY = moveX * 0.008;
      angleY += moveX * 0.01;
      lastMouseX = clientX;
      lastMouseY = clientY;
    } else {
      // Clamped gentle tilt
      targetAngleX = Math.max(-0.5, Math.min(0.5, -deltaY * 0.4));
      targetAngleY = Math.max(-0.8, Math.min(0.8, deltaX * 0.6));
    }
  };

  window.addEventListener('mousemove', (e) => {
    onPointerMove(e.clientX, e.clientY);
  });

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch handlers
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Render Loop
  const render = () => {
    ctx.clearRect(0, 0, width, height);

    floatTime += 0.025;
    const floatY = Math.sin(floatTime * 1.5) * 12;
    const floatTilt = Math.sin(floatTime * 1.1) * 0.05;

    // Apply angular velocity damping
    if (!isDragging) {
      angleY += angularVelY;
      angularVelY *= 0.94; // friction
      angleX += (targetAngleX - angleX) * 0.08;
      angleY += (targetAngleY - angleY) * 0.04;
    }

    const totalAngleX = angleX + floatTilt;
    const totalAngleY = angleY;

    const centerX = width / 2;
    const centerY = height / 2 + floatY;

    // 1. Draw subtle contact shadow below
    ctx.save();
    ctx.translate(centerX, centerY + 130 - floatY * 0.5);
    ctx.scale(1, 0.25);
    const shadowGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    shadowGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Render 3D Dumbbell
    ctx.save();
    ctx.translate(centerX, centerY);

    // Dynamic scale based on selected weight
    const scaleFactor = currentWeight === 10 ? 0.88 : currentWeight === 50 ? 1.15 : 1.0;
    ctx.scale(scaleFactor, scaleFactor);

    // Apply 3D perspective rotation
    ctx.rotate(totalAngleY * 0.35);

    drawDumbbell3D(ctx, totalAngleX, totalAngleY, currentWeight);

    ctx.restore();

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

/**
 * 3D Dumbbell Renderer
 */
function drawDumbbell3D(ctx, tiltX, tiltY, weightKg) {
  const plateRadius = weightKg === 10 ? 68 : weightKg === 50 ? 98 : 82;
  const plateDepth = weightKg === 10 ? 16 : weightKg === 50 ? 32 : 24;
  const handleHalfLength = 70;
  const handleRadius = 14;

  // Light Vector for dynamic metallic sheen
  const lightX = Math.cos(tiltY) * 0.7 - Math.sin(tiltX) * 0.3;

  // A. DRAW LEFT WEIGHT PLATES (Back to Front)
  drawPlateGroup(ctx, -handleHalfLength - plateDepth, plateRadius, plateDepth, -1, tiltX, tiltY, weightKg, lightX);

  // B. DRAW CENTRAL STEEL KNURLED HANDLE
  drawSteelHandle(ctx, -handleHalfLength, handleHalfLength, handleRadius, tiltX, tiltY, lightX);

  // C. DRAW RIGHT WEIGHT PLATES
  drawPlateGroup(ctx, handleHalfLength, plateRadius, plateDepth, 1, tiltX, tiltY, weightKg, lightX);
}

/**
 * Knurled Steel Handle Renderer
 */
function drawSteelHandle(ctx, x1, x2, radius, tiltX, tiltY, lightX) {
  const length = x2 - x1;

  // Base metallic cylinder
  const handleGrad = ctx.createLinearGradient(0, -radius, 0, radius);
  handleGrad.addColorStop(0, '#52525b');
  handleGrad.addColorStop(0.3, '#d4d4d8');
  handleGrad.addColorStop(0.5, '#ffffff'); // bright highlight reflection
  handleGrad.addColorStop(0.8, '#71717a');
  handleGrad.addColorStop(1, '#27272a');

  ctx.fillStyle = handleGrad;
  ctx.beginPath();
  ctx.roundRect(x1, -radius, length, radius * 2, 4);
  ctx.fill();

  // Knurling Grip Texture (cross-hatch subtle pattern)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x1 + 10, -radius + 1, length - 20, radius * 2 - 2, 2);
  ctx.clip();

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1.2;
  for (let i = x1 + 10; i < x2 - 10; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, -radius);
    ctx.lineTo(i + 6, radius);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i + 6, -radius);
    ctx.lineTo(i, radius);
    ctx.stroke();
  }

  // Gold accent rings on collar ends
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x1 + 4, -radius - 1, 4, radius * 2 + 2);
  ctx.fillRect(x2 - 8, -radius - 1, 4, radius * 2 + 2);

  ctx.restore();
}

/**
 * Heavy Cast-Iron Weight Plates Renderer
 */
function drawPlateGroup(ctx, startX, radius, depth, direction, tiltX, tiltY, weightKg, lightX) {
  const numPlates = 2; // dual plate stack on each side
  const singleDepth = depth;

  for (let p = 0; p < numPlates; p++) {
    const px = direction === 1 ? startX + p * (singleDepth + 4) : startX - p * (singleDepth + 4);

    // Plate rim (cylinder barrel)
    const rimGrad = ctx.createLinearGradient(0, -radius, 0, radius);
    rimGrad.addColorStop(0, '#27272a');
    rimGrad.addColorStop(0.4, '#3f3f46');
    rimGrad.addColorStop(0.6, '#52525b');
    rimGrad.addColorStop(1, '#18181b');

    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.roundRect(direction === 1 ? px : px - singleDepth, -radius, singleDepth, radius * 2, 6);
    ctx.fill();

    // Plate outer face
    const faceX = direction === 1 ? px + singleDepth : px - singleDepth;
    const faceGrad = ctx.createRadialGradient(faceX, 0, radius * 0.2, faceX, 0, radius);
    faceGrad.addColorStop(0, '#2e3342');
    faceGrad.addColorStop(0.8, '#141721');
    faceGrad.addColorStop(1, '#090a0f');

    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.ellipse(faceX, 0, 8, radius, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Embossed Weight Stamp Text on outer face
    if (p === numPlates - 1) {
      ctx.save();
      ctx.translate(faceX, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 9px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${weightKg} KG`, 0, -2);
      ctx.font = '7px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('VAJRA', 0, 7);
      ctx.restore();
    }
  }

  // Chrome Collar Cap on end
  const collarX = direction === 1 ? startX + numPlates * (singleDepth + 4) : startX - numPlates * (singleDepth + 4);
  const collarGrad = ctx.createLinearGradient(0, -18, 0, 18);
  collarGrad.addColorStop(0, '#a1a1aa');
  collarGrad.addColorStop(0.5, '#ffffff');
  collarGrad.addColorStop(1, '#52525b');

  ctx.fillStyle = collarGrad;
  ctx.beginPath();
  ctx.roundRect(direction === 1 ? collarX : collarX - 10, -18, 10, 36, 3);
  ctx.fill();
}

/* ==========================================================================
   3. INQUIRY MODAL & WHATSAPP INTEGRATION
   ========================================================================== */
function initModalAndWhatsApp() {
  const modal = document.getElementById('inquiryModal');
  const openBtns = document.querySelectorAll('.trigger-inquiry-modal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const form = document.getElementById('inquiryForm');

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
      const name = document.getElementById('inqName').value || 'Athlete';
      const phone = document.getElementById('inqPhone').value || '';
      const plan = document.getElementById('inqPlan').value;

      if (modal) modal.classList.remove('active');
      showToast(`🔥 Namaste ${name}! Connecting directly with Vajra Concierge...`);

      // Prepare WhatsApp message
      const text = encodeURIComponent(`Namaste Vajra Iron Gym! I am ${name} (${phone}). I would like to inquire about the ${plan} membership and schedule a walkthrough.`);
      const waUrl = `https://wa.me/919876543210?text=${text}`;

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);

      form.reset();
    });
  }
}

/* ==========================================================================
   4. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
