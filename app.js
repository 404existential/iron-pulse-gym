/**
 * IRON PULSE ATHLETICS // Core Interactive Logic & Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initProgramsFilter();
  initScheduleTable();
  initSplitGenerator();
  initBmiCalculator();
  initPricingToggle();
  initModals();
  initAudioWidget();
  initStatsCounter();
});

/* ==========================================================================
   1. NAVBAR & SCROLL EFFECTS
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  const mobileClose = document.querySelector('.mobile-menu-close');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   2. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('[data-counter]');
  let animated = false;

  const runCounter = () => {
    statElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const increment = Math.ceil(target / 45);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current.toLocaleString() + suffix;
      }, 30);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounter();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   3. PROGRAMS FILTER
   ========================================================================== */
function initProgramsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      programCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   4. DYNAMIC SCHEDULE & SPOT RESERVATION
   ========================================================================== */
const scheduleData = {
  mon: [
    { time: '06:30 AM', name: 'Dawn MetCon & Core Shred', trainer: 'Alex Rivera', role: 'Head Coach', spots: 3, cat: 'HIIT', level: 'Intense' },
    { time: '09:00 AM', name: 'Olympic Barbell Clean & Snatch Clinic', trainer: 'Marcus Vance', role: 'USAW Level 3', spots: 6, cat: 'Strength', level: 'Advanced' },
    { time: '12:15 PM', name: 'Lunch Hour Hybrid Conditioning', trainer: 'Elena Rostova', role: 'Master Trainer', spots: 8, cat: 'HIIT', level: 'All Levels' },
    { time: '05:30 PM', name: 'Vanguard Striking & Bag Sparring', trainer: 'Tariq Sterling', role: 'Boxing Champion', spots: 2, cat: 'Combat', level: 'High' },
    { time: '07:15 PM', name: 'Deep Fascial Mobility & Infrared Zen', trainer: 'Dr. Chloe Adams', role: 'Recovery Specialist', spots: 9, cat: 'Recovery', level: 'Restorative' }
  ],
  tue: [
    { time: '06:30 AM', name: 'Hypertrophy Forge: Upper Body Spec', trainer: 'Alex Rivera', role: 'Head Coach', spots: 4, cat: 'Strength', level: 'Heavy' },
    { time: '09:30 AM', name: 'Kettlebell Flow & Calisthenics Grid', trainer: 'Elena Rostova', role: 'Master Trainer', spots: 7, cat: 'Conditioning', level: 'Medium' },
    { time: '05:00 PM', name: 'Vanguard Functional Power Hour', trainer: 'Marcus Vance', role: 'USAW Coach', spots: 5, cat: 'Strength', level: 'Intense' },
    { time: '06:45 PM', name: 'Dutch Kickboxing Fundamentals', trainer: 'Tariq Sterling', role: 'Pro Striker', spots: 3, cat: 'Combat', level: 'All Levels' }
  ],
  wed: [
    { time: '06:30 AM', name: 'Aerobic Engine: Rower & SkiErg Blitz', trainer: 'Elena Rostova', role: 'Endurance Lead', spots: 5, cat: 'HIIT', level: 'Maximum' },
    { time: '10:00 AM', name: 'Posterior Chain Deadlift Mastery', trainer: 'Marcus Vance', role: 'Powerlifting Coach', spots: 4, cat: 'Strength', level: 'Advanced' },
    { time: '05:30 PM', name: 'Titan Barbell Complex & Sled Turf', trainer: 'Alex Rivera', role: 'Head Coach', spots: 2, cat: 'Conditioning', level: 'Hard' },
    { time: '07:30 PM', name: 'Breathwork & Ice Plunge Protocol', trainer: 'Dr. Chloe Adams', role: 'Recovery Specialist', spots: 6, cat: 'Recovery', level: 'Therapeutic' }
  ],
  thu: [
    { time: '06:30 AM', name: 'Hypertrophy Forge: Lower Body Annihilation', trainer: 'Alex Rivera', role: 'Head Coach', spots: 3, cat: 'Strength', level: 'Heavy' },
    { time: '12:00 PM', name: 'Core Matrix & Spinal Integrity', trainer: 'Elena Rostova', role: 'Master Trainer', spots: 8, cat: 'Mobility', level: 'All Levels' },
    { time: '06:00 PM', name: 'Fight Night Conditioning & Mitt Work', trainer: 'Tariq Sterling', role: 'Boxing Champion', spots: 1, cat: 'Combat', level: 'High' }
  ],
  fri: [
    { time: '06:30 AM', name: 'Vanguard Friday MetCon Finale', trainer: 'Alex Rivera & Team', role: 'Performance Coaches', spots: 4, cat: 'HIIT', level: 'Peak' },
    { time: '11:00 AM', name: 'Powerlifting Squat & Bench Mechanics', trainer: 'Marcus Vance', role: 'USAW Level 3', spots: 5, cat: 'Strength', level: 'All Levels' },
    { time: '05:30 PM', name: 'Golden Hour Pump & Outdoor Turf Sprint', trainer: 'Elena Rostova', role: 'Master Trainer', spots: 9, cat: 'Hypertrophy', level: 'Intense' }
  ],
  sat: [
    { time: '08:30 AM', name: 'Weekend Warrior 90-Min Super Circuit', trainer: 'Full Coaching Staff', role: 'Iron Pulse Master Coaches', spots: 6, cat: 'Community', level: 'Epic' },
    { time: '10:30 AM', name: 'Technical Boxing & Heavy Bag Blitz', trainer: 'Tariq Sterling', role: 'Boxing Champion', spots: 4, cat: 'Combat', level: 'Medium' },
    { time: '12:00 PM', name: 'Full Spectrum Contrast Hydro & Sauna', trainer: 'Dr. Chloe Adams', role: 'Recovery Specialist', spots: 10, cat: 'Recovery', level: 'Relaxation' }
  ],
  sun: [
    { time: '09:00 AM', name: 'Total Body Mobility, Hip & Spine Flow', trainer: 'Dr. Chloe Adams', role: 'Mobility Lead', spots: 12, cat: 'Recovery', level: 'All Levels' },
    { time: '11:00 AM', name: 'Open Platform Olympic Lifting Lab', trainer: 'Marcus Vance', role: 'Head Coach', spots: 8, cat: 'Strength', level: 'Self-Paced' }
  ]
};

function initScheduleTable() {
  const dayTabs = document.querySelectorAll('.day-tab');
  const tableContainer = document.getElementById('scheduleTableBody');

  const renderSchedule = (dayKey) => {
    if (!tableContainer) return;
    const classes = scheduleData[dayKey] || [];
    
    tableContainer.innerHTML = classes.map(cls => {
      const isFew = cls.spots <= 3;
      const avatarSrc = cls.trainer.includes('Alex') ? 'assets/images/trainer-alex.jpg' : 
                        cls.trainer.includes('Elena') ? 'assets/images/trainer-elena.jpg' : 
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
      
      return `
        <div class="schedule-row">
          <div class="slot-time">${cls.time}</div>
          <div class="slot-class">
            <h4>${cls.name}</h4>
            <p><span class="badge" style="padding:0.15rem 0.5rem; font-size:0.7rem; margin-right:0.4rem;">${cls.cat}</span> • Difficulty: ${cls.level}</p>
          </div>
          <div class="slot-trainer">
            <img src="${avatarSrc}" alt="${cls.trainer}">
            <div class="slot-trainer-info">
              <h5>${cls.trainer}</h5>
              <span>${cls.role}</span>
            </div>
          </div>
          <div class="slot-availability ${isFew ? 'few' : 'open'}">
            <span class="pulse-dot" style="${isFew ? 'background:#ff5722; box-shadow:0 0 10px #ff5722;' : ''}"></span>
            ${cls.spots} Spots Left
          </div>
          <div>
            <button class="btn btn-volt btn-reserve" style="padding:0.6rem 1.1rem; font-size:0.8rem; width:100%;" 
              data-classname="${cls.name}" data-time="${cls.time}" data-trainer="${cls.trainer}">
              Book Slot
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach event listeners to newly rendered booking buttons
    tableContainer.querySelectorAll('.btn-reserve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cName = e.target.getAttribute('data-classname');
        const cTime = e.target.getAttribute('data-time');
        const cTrainer = e.target.getAttribute('data-trainer');
        openBookingModal(cName, cTime, cTrainer);
      });
    });
  };

  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dayTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSchedule(tab.getAttribute('data-day'));
    });
  });

  // Render initial (Monday)
  renderSchedule('mon');
}

/* ==========================================================================
   5. SMART WORKOUT SPLIT GENERATOR
   ========================================================================== */
const splitTemplates = {
  3: {
    title: '3-Day Full Body Power & Hypertrophy Split',
    description: 'Optimal for maximum recovery and building balanced lean mass with high frequency per muscle group.',
    days: [
      { day: 'Day 1 (Monday)', focus: 'Full Body Heavy Compound', tag: 'Squat & Bench Focus', exercises: 'Back Squat (4x6), Flat Barbell Bench (4x8), Barbell Rows (3x8), Romanian Deadlift (3x10), Overhead Press (3x8)' },
      { day: 'Day 2 (Wednesday)', focus: 'Full Body Deadlift & Vertical Pull', tag: 'Posterior Chain', exercises: 'Conventional Deadlift (3x5), Pull-Ups (4xMax), Incline DB Press (3x10), Walking Lunges (3x12/leg), Lateral Raises (4x15)' },
      { day: 'Day 3 (Friday)', focus: 'Full Body Dynamic Hypertrophy', tag: 'Arm & Core Volume', exercises: 'Front Squat (3x8), Neutral Grip DB Bench (4x10), Chest-Supported Rows (3x12), Leg Curls (3x15), Biceps/Triceps Superset (4x12)' }
    ]
  },
  4: {
    title: '4-Day Upper / Lower Strength-Athlete Split',
    description: 'The gold standard for athletic development, balancing heavy neurological loads with hypertrophy volume.',
    days: [
      { day: 'Day 1 (Monday)', focus: 'Upper Body Power', tag: 'Strength Peak', exercises: 'Barbell Bench Press (5x5), Barbell Pendlay Row (4x6), Standing Military Press (3x6), Weighted Dips (3x8)' },
      { day: 'Day 2 (Tuesday)', focus: 'Lower Body Strength', tag: 'Squat Dominant', exercises: 'Competition Barbell Squat (4x5), Romanian Deadlift (4x8), Bulgarian Split Squats (3x10/leg), Standing Calf Raises (4x15)' },
      { day: 'Day 3 (Thursday)', focus: 'Upper Body Hypertrophy', tag: 'Volume Density', exercises: 'Incline Dumbbell Press (4x10), Lat Pulldown (4x10), Cable Lateral Raises (4x15), Facepulls (3x15), Skull Crushers & Hammer Curls (4x12)' },
      { day: 'Day 4 (Friday)', focus: 'Lower Body & Posterior Focus', tag: 'Deadlift Dominant', exercises: 'Conventional or Sumo Deadlift (4x4), Front Squat (3x8), Leg Extensions & Hamstring Curls (3x12), Hanging Leg Raises (4x15)' }
    ]
  },
  5: {
    title: '5-Day Push / Pull / Legs + Upper / Lower (PPLUL)',
    description: 'Advanced high-volume protocol targeting elite muscle development, symmetry, and progressive overload.',
    days: [
      { day: 'Day 1 (Monday)', focus: 'Push Focus (Chest / Shoulders / Triceps)', tag: 'PPL Cycle', exercises: 'Barbell Bench Press (4x6), Overhead Dumbbell Press (3x8), Incline DB Fly (3x12), Cable Triceps Pushdowns (4x12)' },
      { day: 'Day 2 (Tuesday)', focus: 'Pull Focus (Back / Biceps / Rear Delts)', tag: 'PPL Cycle', exercises: 'Weighted Pull-Ups (4x6), Barbell Bent Over Row (4x8), Seated Cable Row (3x10), Incline Dumbbell Curls (4x12)' },
      { day: 'Day 3 (Wednesday)', focus: 'Legs & Core Performance', tag: 'PPL Cycle', exercises: 'Barbell Back Squats (4x8), Romanian Deadlifts (4x8), Leg Press (3x12), Standing Calf Raises (4x15)' },
      { day: 'Day 4 (Friday)', focus: 'Upper Body Power & Density', tag: 'Heavy Hybrid', exercises: 'Incline Barbell Bench (4x6), T-Bar Row (4x8), Neutral Dumbbell Press (3x10), Lateral Delt Triad (4x12)' },
      { day: 'Day 5 (Saturday)', focus: 'Lower Body Hypertrophy & Plyo', tag: 'Athletic Conditioning', exercises: 'Trap Bar Deadlift (4x6), Walking DB Lunges (3x12/leg), Glute Ham Developer (3x12), Ab Wheel Rollouts (4x15)' }
    ]
  },
  6: {
    title: '6-Day Push / Pull / Legs (PPL x 2) Elite Split',
    description: 'Maximum training stimulus for dedicated athletes. 2x weekly frequency per muscle group with high metabolic load.',
    days: [
      { day: 'Day 1 & 4 (Mon / Thu)', focus: 'Push 1 (Strength) & Push 2 (Pump)', tag: 'Chest/Delt/Tri', exercises: 'Flat Bench, Incline DB Press, Overhead Press, Cable Lateral Flyes, Overhead French Press' },
      { day: 'Day 2 & 5 (Tue / Fri)', focus: 'Pull 1 (Heavy Rows) & Pull 2 (Lat Width)', tag: 'Back/Rear/Bi', exercises: 'Barbell Deadlifts/Rack Pulls, Weighted Chins, Meadows Rows, Facepulls, Incline Spider Curls' },
      { day: 'Day 3 & 6 (Wed / Sat)', focus: 'Legs 1 (Quad Heavy) & Legs 2 (Hamstring Heavy)', tag: 'Lower Body', exercises: 'High Bar Squats, RDLs, Hack Squats, Bulgarian Split Squats, Seated Leg Curls, Standing Calves' }
    ]
  }
};

function initSplitGenerator() {
  const daysSelect = document.getElementById('splitDays');
  const goalSelect = document.getElementById('splitGoal');
  const levelSelect = document.getElementById('splitLevel');
  const generateBtn = document.getElementById('btnGenerateSplit');
  const splitContainer = document.getElementById('splitResultContainer');

  const renderSplit = () => {
    if (!splitContainer) return;
    const days = daysSelect ? daysSelect.value : '4';
    const goal = goalSelect ? goalSelect.value : 'Hypertrophy';
    const level = levelSelect ? levelSelect.value : 'Intermediate';

    const template = splitTemplates[days] || splitTemplates[4];

    splitContainer.innerHTML = `
      <div style="margin-bottom:1rem; padding: 0.8rem 1rem; background:rgba(204,255,0,0.06); border-radius:8px; border:1px solid rgba(204,255,0,0.2);">
        <h4 style="color:#ccff00; font-size:1.1rem; margin-bottom:0.2rem;">${template.title}</h4>
        <p style="font-size:0.85rem; color:#cbd5e1;">Target Goal: <strong>${goal}</strong> • Athlete Level: <strong>${level}</strong></p>
        <p style="font-size:0.8rem; color:#9ca3af; margin-top:0.3rem;">${template.description}</p>
      </div>
      ${template.days.map(d => `
        <div class="split-day-card">
          <div style="flex:1; padding-right:1rem;">
            <div class="split-day-title">${d.day} — ${d.focus}</div>
            <div class="split-day-desc">${d.exercises}</div>
          </div>
          <div class="split-day-tag">${d.tag}</div>
        </div>
      `).join('')}
      <button class="btn btn-secondary" id="btnPrintRoutine" style="margin-top:1rem; width:100%; font-size:0.85rem; padding:0.75rem;">
        📥 Save / Download Workout Plan (.txt)
      </button>
    `;

    const printBtn = document.getElementById('btnPrintRoutine');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        downloadWorkoutText(template, goal, level);
      });
    }
  };

  if (generateBtn) {
    generateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderSplit();
      showToast('⚡ Custom workout routine generated successfully!');
    });
  }

  // Initial render
  renderSplit();
}

function downloadWorkoutText(template, goal, level) {
  let content = `========================================================\n`;
  content += `IRON PULSE ATHLETICS // CUSTOM ATHLETE ROUTINE\n`;
  content += `Goal: ${goal} | Athlete Tier: ${level}\n`;
  content += `Plan: ${template.title}\n`;
  content += `========================================================\n\n`;

  template.days.forEach(d => {
    content += `[${d.day}] -> ${d.focus} (${d.tag})\n`;
    content += `Prescribed Exercises: ${d.exercises}\n\n`;
  });

  content += `Iron Pulse Athletics • 742 Performance Way • Fuel The Fire\n`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `IronPulse_${goal}_Workout_Plan.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📄 Downloaded your tailored workout routine!');
}

/* ==========================================================================
   6. BIOMETRIC BMI & MACRO TARGET CALCULATOR
   ========================================================================== */
function initBmiCalculator() {
  const heightSlider = document.getElementById('calcHeight');
  const weightSlider = document.getElementById('calcWeight');
  const heightValDisplay = document.getElementById('heightDisplay');
  const weightValDisplay = document.getElementById('weightDisplay');
  const activitySelect = document.getElementById('calcActivity');
  const goalToggles = document.querySelectorAll('.goal-toggle');

  const bmiScoreEl = document.getElementById('bmiScore');
  const bmiBadgeEl = document.getElementById('bmiBadge');
  const tdeeCaloriesEl = document.getElementById('tdeeCalories');
  const proteinGramEl = document.getElementById('proteinGram');
  const carbsGramEl = document.getElementById('carbsGram');
  const fatsGramEl = document.getElementById('fatsGram');

  const proteinFill = document.getElementById('proteinFill');
  const carbsFill = document.getElementById('carbsFill');
  const fatsFill = document.getElementById('fatsFill');

  let currentGoal = 'recomp'; // shred, recomp, bulk

  goalToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      goalToggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGoal = btn.getAttribute('data-goal');
      updateCalculations();
    });
  });

  const updateCalculations = () => {
    if (!heightSlider || !weightSlider) return;

    const heightCm = parseFloat(heightSlider.value);
    const weightKg = parseFloat(weightSlider.value);
    const activityMultiplier = parseFloat(activitySelect ? activitySelect.value : 1.55);

    if (heightValDisplay) heightValDisplay.textContent = `${heightCm} cm`;
    if (weightValDisplay) weightValDisplay.textContent = `${weightKg} kg`;

    // BMI calculation: weight / (height in meters)^2
    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);

    if (bmiScoreEl) bmiScoreEl.textContent = bmi;

    let category = 'Normal Weight';
    let badgeColor = '#ccff00';
    if (bmi < 18.5) {
      category = 'Underweight';
      badgeColor = '#00e5ff';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Athletic / Optimal';
      badgeColor = '#ccff00';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Muscular / Overweight';
      badgeColor = '#ffb703';
    } else {
      category = 'High Mass / Bulk Tier';
      badgeColor = '#ff5722';
    }

    if (bmiBadgeEl) {
      bmiBadgeEl.textContent = category;
      bmiBadgeEl.style.color = badgeColor;
      bmiBadgeEl.style.backgroundColor = `${badgeColor}22`;
      bmiBadgeEl.style.borderColor = `${badgeColor}55`;
    }

    // Basal Metabolic Rate (Mifflin-St Jeor formula estimate)
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * 28 + 5;
    let tdee = Math.round(bmr * activityMultiplier);

    // Goal adjustment
    let targetCalories = tdee;
    if (currentGoal === 'shred') {
      targetCalories = Math.round(tdee * 0.80); // 20% deficit
    } else if (currentGoal === 'bulk') {
      targetCalories = Math.round(tdee * 1.15); // 15% surplus
    }

    if (tdeeCaloriesEl) tdeeCaloriesEl.textContent = `${targetCalories.toLocaleString()} kcal/day`;

    // Macronutrient Split
    // Protein: 2.2g per kg of bodyweight
    const proteinGrams = Math.round(weightKg * 2.2);
    const proteinCals = proteinGrams * 4;

    // Fats: 25% of total calories
    const fatsCals = targetCalories * 0.25;
    const fatsGrams = Math.round(fatsCals / 9);

    // Remaining calories to Carbs
    const remainingCals = Math.max(0, targetCalories - (proteinCals + fatsCals));
    const carbsGrams = Math.round(remainingCals / 4);

    if (proteinGramEl) proteinGramEl.textContent = `${proteinGrams}g (${Math.round((proteinCals / targetCalories) * 100)}%)`;
    if (carbsGramEl) carbsGramEl.textContent = `${carbsGrams}g (${Math.round((remainingCals / targetCalories) * 100)}%)`;
    if (fatsGramEl) fatsGramEl.textContent = `${fatsGrams}g (${Math.round((fatsCals / targetCalories) * 100)}%)`;

    // Width percentages for bars
    if (proteinFill) proteinFill.style.width = `${Math.min(100, Math.round((proteinCals / targetCalories) * 100))}%`;
    if (carbsFill) carbsFill.style.width = `${Math.min(100, Math.round((remainingCals / targetCalories) * 100))}%`;
    if (fatsFill) fatsFill.style.width = `${Math.min(100, Math.round((fatsCals / targetCalories) * 100))}%`;
  };

  if (heightSlider) heightSlider.addEventListener('input', updateCalculations);
  if (weightSlider) weightSlider.addEventListener('input', updateCalculations);
  if (activitySelect) activitySelect.addEventListener('change', updateCalculations);

  updateCalculations();
}

/* ==========================================================================
   7. MEMBERSHIP PRICING BILLING TOGGLE
   ========================================================================== */
function initPricingToggle() {
  const toggleBtn = document.getElementById('billingToggleBtn');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  const priceElements = document.querySelectorAll('.plan-price-value');

  let isAnnual = false;

  const toggleBilling = () => {
    isAnnual = !isAnnual;
    if (toggleBtn) {
      toggleBtn.classList.toggle('annual', isAnnual);
    }
    if (monthlyLabel) monthlyLabel.classList.toggle('active', !isAnnual);
    if (annualLabel) annualLabel.classList.toggle('active', isAnnual);

    priceElements.forEach(el => {
      const monthlyPrice = el.getAttribute('data-monthly');
      const annualPrice = el.getAttribute('data-annual');
      el.textContent = isAnnual ? annualPrice : monthlyPrice;
    });

    showToast(isAnnual ? '🎉 Annual membership 20% savings applied!' : 'Billed on a monthly basis.');
  };

  if (toggleBtn) toggleBtn.addEventListener('click', toggleBilling);
  if (monthlyLabel) monthlyLabel.addEventListener('click', () => { if (isAnnual) toggleBilling(); });
  if (annualLabel) annualLabel.addEventListener('click', () => { if (!isAnnual) toggleBilling(); });
}

/* ==========================================================================
   8. MODALS & PASS GENERATOR
   ========================================================================== */
function initModals() {
  const trialBackdrop = document.getElementById('trialPassModal');
  const bookingBackdrop = document.getElementById('bookingModal');
  const openTrialBtns = document.querySelectorAll('.trigger-trial-modal');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  openTrialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (trialBackdrop) trialBackdrop.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (trialBackdrop) trialBackdrop.classList.remove('active');
      if (bookingBackdrop) bookingBackdrop.classList.remove('active');
    });
  });

  // Close on backdrop click
  [trialBackdrop, bookingBackdrop].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  });

  // Pass generation form handler
  const passForm = document.getElementById('trialPassForm');
  const passResultWrap = document.getElementById('passResultWrap');

  if (passForm) {
    passForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('passUserName').value || 'Elite Athlete';
      const email = document.getElementById('passUserEmail').value || 'member@ironpulse.com';
      const goal = document.getElementById('passUserGoal').value;

      const randomCode = 'IP-' + Math.floor(100000 + Math.random() * 900000);
      const today = new Date();
      const expires = new Date();
      expires.setDate(today.getDate() + 7);

      const expDateString = expires.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      passForm.style.display = 'none';
      if (passResultWrap) {
        passResultWrap.style.display = 'block';
        passResultWrap.innerHTML = `
          <div class="digital-pass-card">
            <div class="pass-watermark">PULSE</div>
            <div class="pass-header">
              <span class="badge">7-Day VIP Guest Pass</span>
              <span class="pass-code">${randomCode}</span>
            </div>
            <div class="pass-holder-info">
              <div class="pass-name">${name}</div>
              <div class="pass-dates">Valid From: Today • Expires: <strong>${expDateString}</strong></div>
              <div style="font-size:0.8rem; color:#ccff00; margin-top:0.3rem;">Focus: ${goal} • All Facility Access</div>
            </div>
            <div class="qr-representation">
              <div style="font-size:0.75rem; color:#9ca3af;">Show at Front Desk Concierge</div>
              <div class="barcode-visual">
                <span class="barcode-bar" style="width:2px;"></span>
                <span class="barcode-bar" style="width:4px;"></span>
                <span class="barcode-bar" style="width:1px;"></span>
                <span class="barcode-bar" style="width:5px;"></span>
                <span class="barcode-bar" style="width:2px;"></span>
                <span class="barcode-bar" style="width:3px;"></span>
                <span class="barcode-bar" style="width:6px;"></span>
                <span class="barcode-bar" style="width:2px;"></span>
              </div>
            </div>
          </div>
          <button class="btn btn-volt" id="btnSavePass" style="width:100%; margin-top:0.8rem;">
            📸 Save Pass To Phone
          </button>
        `;

        document.getElementById('btnSavePass').addEventListener('click', () => {
          showToast(`✅ VIP Pass ${randomCode} saved to your device!`);
          setTimeout(() => {
            if (trialBackdrop) trialBackdrop.classList.remove('active');
            passForm.reset();
            passForm.style.display = 'block';
            passResultWrap.style.display = 'none';
          }, 1500);
        });
      }

      showToast(`🔥 VIP Pass created for ${name}! Welcome to Iron Pulse.`);
    });
  }

  // Booking Form submit
  const bookingForm = document.getElementById('classBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bName = document.getElementById('bookUserName').value;
      const bClass = document.getElementById('bookModalClassName').textContent;
      const bTime = document.getElementById('bookModalTime').textContent;

      if (bookingBackdrop) bookingBackdrop.classList.remove('active');
      showToast(`🥊 Spot Confirmed for ${bName} in ${bClass} at ${bTime}!`);
      bookingForm.reset();
    });
  }
}

function openBookingModal(className, time, trainer) {
  const bookingModal = document.getElementById('bookingModal');
  const classDisplay = document.getElementById('bookModalClassName');
  const timeDisplay = document.getElementById('bookModalTime');
  const trainerDisplay = document.getElementById('bookModalTrainer');

  if (classDisplay) classDisplay.textContent = className;
  if (timeDisplay) timeDisplay.textContent = time;
  if (trainerDisplay) trainerDisplay.textContent = `Coached by ${trainer}`;

  if (bookingModal) bookingModal.classList.add('active');
}

/* ==========================================================================
   9. SYNTHETIC AUDIO BEATS WIDGET (Vanilla Web Audio API)
   ========================================================================== */
function initAudioWidget() {
  const audioBtn = document.getElementById('audioPlayBtn');
  const audioWidget = document.querySelector('.audio-widget');
  const audioTitle = document.querySelector('.audio-title');
  const audioDesc = document.querySelector('.audio-desc');

  let audioCtx = null;
  let isPlaying = false;
  let beatInterval = null;
  let step = 0;

  const startBeats = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    audioWidget.classList.add('audio-playing');
    audioBtn.innerHTML = '⏸';
    audioTitle.textContent = 'PULSE BEATS: ACTIVE';
    audioDesc.textContent = '128 BPM Synthwave Flow';

    // Rhythmic 128 BPM synthesizer loop
    const stepTime = (60 / 128) * 1000 / 2; // eighth notes
    const chords = [
      [130.81, 164.81, 196.00], // C minor / power
      [116.54, 146.83, 174.61], // Bb
      [103.83, 130.81, 155.56], // Ab
      [116.54, 146.83, 174.61]  // Bb
    ];

    beatInterval = setInterval(() => {
      const currentChord = chords[Math.floor(step / 8) % chords.length];
      
      // Kick beat on quarters
      if (step % 2 === 0) {
        playKick(audioCtx);
      }
      // Hi-hat on off-beats
      if (step % 2 === 1) {
        playHat(audioCtx);
      }
      // Synth bass note
      const noteFreq = currentChord[step % currentChord.length];
      playSynth(audioCtx, noteFreq);

      step++;
    }, stepTime);
  };

  const stopBeats = () => {
    isPlaying = false;
    clearInterval(beatInterval);
    audioWidget.classList.remove('audio-playing');
    audioBtn.innerHTML = '▶';
    audioTitle.textContent = 'WORKOUT BEATS';
    audioDesc.textContent = 'Tap to play gym audio';
  };

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (!isPlaying) {
        startBeats();
        showToast('🎵 Iron Pulse Workout Beats soundtrack playing');
      } else {
        stopBeats();
      }
    });
  }
}

function playKick(ctx) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

function playHat(ctx) {
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
}

function playSynth(ctx, freq) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.22);
}

/* ==========================================================================
   10. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
