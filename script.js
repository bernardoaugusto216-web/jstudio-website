document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  // Initialize all modules
  initLenis();
  initCustomCursor();
  initParticles();
  initNavbar();
  initHeroAnimations();
  initStatsCounter();
  initScrollAnimations();
  initServiceCards();
  initTimeline();
  initPortfolioFilter();
  initTestimonialsCarousel();
  initFAQ();
  initModal();
  initFormValidation();
  initMagneticButtons();
  initContainerScroll();
  initDeviceParallax();
  initCurrentYear();

  // Newsletter Form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value.trim()) {
        input.value = '';
        input.placeholder = 'Inscrito com sucesso! ✓';
        setTimeout(() => { input.placeholder = 'Seu email'; }, 3000);
      }
    });
  }
});

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  
  const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.4,
    touchMultiplier: 1.8,
    autoResize: true,
  });
  
  // Connect Lenis to GSAP ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback: standalone raf loop only when GSAP is not loaded
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
  
  // Store reference globally for modal control
  window.__lenis = lenis;
}

function initCustomCursor() {
  // Only on desktop (hover capable devices)
  if (window.matchMedia('(hover: none)').matches) return;
  
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('cursorFollower');
  const glow = document.getElementById('cursorGlow');
  
  if (!cursor || !follower || !glow) return;
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Smooth cursor following using requestAnimationFrame
  function animate() {
    // Cursor follows instantly
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Follower follows with delay
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    
    // Glow follows with more delay
    glow.style.left = mouseX + 'px';
    glow.style.top = mouseY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();
  
  // Hover effects on interactive elements
  const hoverElements = document.querySelectorAll('a, button, .service-card, .portfolio-item, .tech-item, .faq-question');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });
}

function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let dpr = window.devicePixelRatio || 1;
  let particles = [];
  let ambientMotes = [];
  let energyPulses = [];
  
  // Responsive particle density — reduced on mobile for performance
  const getParticleCount = () => {
    if (window.innerWidth < 480) return 18;
    if (window.innerWidth < 768) return 30;
    return 75;
  };
  const getMoteCount = () => {
    if (window.innerWidth < 480) return 10;
    if (window.innerWidth < 768) return 18;
    return 45;
  };
  const maxDistance = 165;
  const mouseDistance = 190;
  
  // Interactive mouse state
  const mouse = {
    x: null,
    y: null,
    targetX: null,
    targetY: null,
    radius: mouseDistance,
    isActive: false
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isActive = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.targetX = null;
    mouse.targetY = null;
    mouse.isActive = false;
  });

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    
    initObjects();
  }

  // Neural Node Particle
  class NeuralParticle {
    constructor() {
      this.reset(true);
    }
    
    reset(initial = false) {
      this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? 0 : width);
      this.y = Math.random() * height;
      this.baseVx = (Math.random() - 0.5) * 0.45;
      this.baseVy = (Math.random() - 0.5) * 0.45;
      this.vx = this.baseVx;
      this.vy = this.baseVy;
      
      this.baseRadius = Math.random() * 2.2 + 1.2;
      this.radius = this.baseRadius;
      
      this.baseOpacity = Math.random() * 0.45 + 0.3;
      this.opacity = this.baseOpacity;
      
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulse = Math.random() * Math.PI * 2;
      
      // Dark orange & brownish amber spectrum
      const palettes = [
        { color: '211, 84, 0', glow: 'rgba(211, 84, 0, 0.85)' },    // Deep burnt orange
        { color: '184, 68, 10', glow: 'rgba(184, 68, 10, 0.8)' },   // Warm brownish terracotta
        { color: '230, 81, 0', glow: 'rgba(230, 81, 0, 0.85)' },    // Dark amber orange
        { color: '243, 134, 18', glow: 'rgba(243, 134, 18, 0.9)' }  // Warm cognac highlight
      ];
      const selected = palettes[Math.floor(Math.random() * palettes.length)];
      this.rgb = selected.color;
      this.glowColor = selected.glow;
      this.flashIntensity = 0;
    }
    
    update() {
      // Harmonic pulse
      this.pulse += this.pulseSpeed;
      this.opacity = this.baseOpacity + Math.sin(this.pulse) * 0.18 + this.flashIntensity;
      this.radius = this.baseRadius + Math.sin(this.pulse) * 0.4 + (this.flashIntensity * 1.5);
      
      if (this.flashIntensity > 0) {
        this.flashIntensity *= 0.92;
        if (this.flashIntensity < 0.01) this.flashIntensity = 0;
      }
      
      // Mouse interaction (soft attraction / gentle deflection)
      if (mouse.isActive && mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 0.08;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
      }
      
      // Apply friction towards base speed
      this.vx = this.vx * 0.98 + this.baseVx * 0.02;
      this.vy = this.vy * 0.98 + this.baseVy * 0.02;
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Wrap around edges smoothly
      if (this.x < -20) this.x = width + 20;
      else if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      else if (this.y > height + 20) this.y = -20;
    }
    
    draw() {
      const currentOpacity = Math.max(0, Math.min(1, this.opacity));
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.radius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.rgb}, ${currentOpacity})`;
      ctx.shadowBlur = this.radius > 2 || this.flashIntensity > 0.1 ? 14 : 6;
      ctx.shadowColor = this.glowColor;
      ctx.fill();
      ctx.restore();
    }
  }

  // Deep Background Floating Motes (Subtle Parallax / Bokeh Star Dust)
  class AmbientMote {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.18;
      this.vy = -Math.random() * 0.25 - 0.05; // Gentle upward floating
      this.radius = Math.random() * 1.3 + 0.4;
      this.alpha = Math.random() * 0.3 + 0.08;
      this.pulse = Math.random() * Math.PI;
      this.pulseSpeed = Math.random() * 0.015 + 0.005;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      
      if (this.y < -10) this.y = height + 10;
      if (this.x < -10) this.x = width + 10;
      else if (this.x > width + 10) this.x = -10;
    }
    
    draw() {
      const a = this.alpha + Math.sin(this.pulse) * 0.08;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(205, 85, 15, ${Math.max(0, a)})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // Energy Data Pulses traveling between connected nodes
  class EnergyPulse {
    constructor(p1, p2) {
      this.p1 = p1;
      this.p2 = p2;
      this.progress = 0;
      this.speed = Math.random() * 0.02 + 0.018; // Speed along line
      this.size = Math.random() * 1.8 + 1.2;
      this.alive = true;
    }
    
    update() {
      this.progress += this.speed;
      if (this.progress >= 1) {
        this.alive = false;
        // Trigger a flash on destination particle
        this.p2.flashIntensity = 0.5;
      }
    }
    
    draw() {
      if (!this.alive) return;
      const currentX = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
      const currentY = this.p1.y + (this.p2.y - this.p1.y) * this.progress;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(currentX, currentY, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF0E5';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(243, 134, 18, 0.95)';
      ctx.fill();
      ctx.restore();
    }
  }

  function initObjects() {
    particles = [];
    ambientMotes = [];
    energyPulses = [];
    
    const count = getParticleCount();
    const motesCount = getMoteCount();
    
    for (let i = 0; i < count; i++) {
      particles.push(new NeuralParticle());
    }
    for (let i = 0; i < motesCount; i++) {
      ambientMotes.push(new AmbientMote());
    }
  }

  function handleEnergyPulses() {
    // Random chance to launch new energy pulse between nearby particles
    if (energyPulses.length < 5 && Math.random() < 0.04 && particles.length > 2) {
      const idx1 = Math.floor(Math.random() * particles.length);
      const p1 = particles[idx1];
      
      // Find a close neighbor
      for (let j = 0; j < particles.length; j++) {
        if (idx1 === j) continue;
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDistance) {
          energyPulses.push(new EnergyPulse(p1, p2));
          break;
        }
      }
    }
    
    for (let i = energyPulses.length - 1; i >= 0; i--) {
      const ep = energyPulses[i];
      ep.update();
      ep.draw();
      if (!ep.alive) {
        energyPulses.splice(i, 1);
      }
    }
  }

  function drawConnections() {
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p1 = particles[i];
      
      // Connect to mouse if within radius
      if (mouse.isActive && mouse.x !== null) {
        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          const mOpacity = (1 - mdist / mouse.radius) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(230, 95, 15, ${mOpacity})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
      
      // Connect with neighboring particles
      for (let j = i + 1; j < len; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.16;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(195, 75, 10, ${opacity})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }
  }

  let animationFrameId;
  let isRunning = true;

  function animate() {
    if (!isRunning) return;
    
    // Smooth mouse coordinate interpolation
    if (mouse.targetX !== null && mouse.targetY !== null) {
      if (mouse.x === null) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      }
    }
    
    ctx.clearRect(0, 0, width, height);
    
    // 1. Draw ambient floating motes
    ambientMotes.forEach(m => {
      m.update();
      m.draw();
    });
    
    // 2. Draw neural node particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // 3. Draw connecting mesh & mouse laser threads
    drawConnections();
    
    // 4. Update & draw energy data pulses
    handleEnergyPulses();
    
    animationFrameId = requestAnimationFrame(animate);
  }

  // Handle visibility change to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isRunning = true;
      animationFrameId = requestAnimationFrame(animate);
    }
  });

  window.addEventListener('resize', resize);
  resize();
  animate();
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('overflow-hidden');
    });
    
    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }
  
  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const targetPosition = target.offsetTop - offset;
        if (window.__lenis) {
          window.__lenis.scrollTo(targetPosition);
        } else {
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });
  
  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  if (document.querySelector('.hero-badge')) {
    heroTl
      .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6, delay: 0.3 })
      .from('.hero-title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
      .from('.hero-description', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
      .from('.hero-buttons .btn-primary', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-buttons .btn-secondary', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-clients', { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
      .from('.device-laptop', { opacity: 0, x: 50, rotationY: 15, duration: 1 }, '-=0.8')
      .from('.device-tablet', { opacity: 0, x: 30, rotationY: -10, duration: 0.8 }, '-=0.6')
      .from('.device-phone', { opacity: 0, y: 30, rotationY: 10, duration: 0.8 }, '-=0.6');
  }
}

function initStatsCounter() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    const suffix = stat.dataset.suffix || '';
    const prefix = stat.dataset.prefix || '';
    
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(stat, {
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            const progress = this.progress();
            const current = Math.round(target * progress);
            stat.textContent = prefix + current + suffix;
          },
          onComplete: () => {
            stat.textContent = prefix + target + suffix;
          }
        });
      },
      once: true
    });
  });
}

function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  // Fade in and slide up for section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
  
  // Stagger animations for grid items
  const grids = [
    { selector: '.differentials-grid .differential-card', stagger: 0.1 },
    { selector: '.tech-grid .tech-item', stagger: 0.05 },
  ];
  
  grids.forEach(({ selector, stagger }) => {
    const items = gsap.utils.toArray(selector);
    if (items.length === 0) return;
    
    gsap.from(items, {
      scrollTrigger: {
        trigger: items[0].parentElement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: stagger,
      ease: 'power3.out'
    });
  });
  
  // Portfolio items with scale
  const portfolioItems = gsap.utils.toArray('.portfolio-item');
  if (portfolioItems.length > 0) {
    portfolioItems.forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });
  }
  
  // Stats section
  if (document.querySelector('.stat-item')) {
    gsap.from('.stat-item', {
      scrollTrigger: {
        trigger: '.stats',
        start: 'top 85%',
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }
  
  // CTA section
  if (document.querySelector('.cta-content')) {
    gsap.from('.cta-content', {
      scrollTrigger: {
        trigger: '.cta',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
  
  // FAQ items
  const faqItems = gsap.utils.toArray('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
        },
        opacity: 0,
        x: -30,
        duration: 0.5,
        delay: i * 0.08,
        ease: 'power3.out'
      });
    });
  }
}

function initServiceCards() {
  const container = document.getElementById('servicesFanStage');
  const allCards = Array.from(document.querySelectorAll('.service-card.fan-card'));
  const deptBtns = document.querySelectorAll('.dept-btn');
  const prevBtn = document.getElementById('fanPrevBtn');
  const nextBtn = document.getElementById('fanNextBtn');
  const dotsContainer = document.getElementById('fanDots');
  
  if (!container || allCards.length === 0) return;

  const MAX_VISIBLE = 7;
  const HALF = 3;

  const FAN_POSITIONS = [
    { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
    { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
    { rot: -7,  scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
    { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, zIndex: 10 },
    { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, zIndex: 3 },
    { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, zIndex: 2 },
    { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, zIndex: 1 },
  ];

  function getResponsiveMultiplier(width) {
    if (width < 480) return 0.28;
    if (width < 640) return 0.38;
    if (width < 768) return 0.52;
    if (width < 1024) return 0.76;
    return 1.0;
  }

  function getHeightMultiplier(width) {
    let idealPx;
    if (width < 480) idealPx = 22 * 16;
    else if (width < 640) idealPx = 26 * 16;
    else if (width < 768) idealPx = 28 * 16;
    else if (width < 1024) idealPx = 34 * 16;
    else idealPx = 38 * 16;

    const available = window.innerHeight * 0.7;
    if (available >= idealPx) return 1;
    return Math.max(0.6, available / idealPx);
  }

  function getSlotConfig(totalCards, slot) {
    if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
    const center = totalCards >> 1;
    const distance = totalCards > 1 ? (slot - center) / center : 0;
    const absDistance = Math.abs(distance);
    return {
      rot: distance * 21,
      scale: 1.0 - 0.2244 * absDistance * absDistance,
      x: distance * 30,
      y: absDistance * absDistance * 7.3,
      zIndex: 10 - Math.abs(slot - center),
    };
  }

  let currentDept = 'all';
  let activeCards = [...allCards];
  let totalCards = activeCards.length;
  let needsPagination = totalCards > MAX_VISIBLE;
  let centerIndex = needsPagination ? HALF : totalCards >> 1;
  let isAnimating = false;
  let hasEntered = false;
  let direction = null;
  let prevVisible = new Set();
  let activeHoverSlot = null;
  let leaveTimer = null;

  function getVisibleMap(center) {
    const map = new Map();
    if (!needsPagination) {
      activeCards.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      const idx = ((center + slot - HALF) % totalCards + totalCards) % totalCards;
      map.set(idx, slot);
    }
    return map;
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    
    if (!needsPagination) {
      dotsContainer.style.display = 'none';
      return;
    }
    dotsContainer.style.display = 'flex';

    activeCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `fan-dot ${i === centerIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir para o serviço ${i + 1}`);
      dot.addEventListener('click', () => {
        if (isAnimating || i === centerIndex) return;
        direction = i > centerIndex ? 'right' : 'left';
        centerIndex = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel(isFirstMount = false) {
    if (!container || !totalCards) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating = true;

    // Hide inactive cards (filtered out)
    allCards.forEach(card => {
      if (!activeCards.includes(card)) {
        card.style.display = 'none';
        if (typeof gsap !== 'undefined') {
          gsap.set(card, { opacity: 0, scale: 0.3, zIndex: 0 });
        }
      } else {
        card.style.display = 'flex';
      }
    });

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating = false;
        if (isFirstMount) hasEntered = true;
      }
    };

    activeCards.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (typeof gsap !== 'undefined') {
          if (isFirstMount) {
            gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
            gsap.to(card, { ...target, duration: 1.1, ease: 'elastic.out(1.05,.78)', delay: 0.1 + slot * 0.05, onComplete: onCardDone });
          } else if (!wasVisible) {
            const enterX = direction === 'right' ? 35 : -35;
            gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === 'right' ? 25 : -25, scale: 0.5, opacity: 0 });
            gsap.to(card, { ...target, duration: 0.55, ease: 'power2.out', onComplete: onCardDone });
          } else {
            gsap.to(card, { ...target, duration: 0.48, ease: 'power2.out', onComplete: onCardDone });
          }
        } else {
          card.style.transform = `translate(${target.x}, ${target.y}) rotate(${target.rotation}deg) scale(${target.scale})`;
          card.style.opacity = '1';
          card.style.zIndex = target.zIndex;
          onCardDone();
        }
      } else if (wasVisible) {
        const exitX = direction === 'right' ? -35 : 35;
        if (typeof gsap !== 'undefined') {
          gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === 'right' ? -25 : 25, duration: 0.38, ease: 'power2.in', zIndex: 0 });
        } else {
          card.style.opacity = '0';
        }
      } else if (isFirstMount) {
        if (typeof gsap !== 'undefined') {
          gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
        }
      }
    });

    prevVisible = new Set(visibleMap.keys());
    renderDots();
    bindHoverEvents();
  }

  function updateHoverLayout(hoveredSlot) {
    if (typeof gsap === 'undefined') return;

    const visibleMap = getVisibleMap(centerIndex);
    const visibleEntries = [];
    activeCards.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    const mult = getResponsiveMultiplier(window.innerWidth);
    const hM = getHeightMultiplier(window.innerWidth);
    const centerSlot = visibleEntries.length >> 1;
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot) => getSlotConfig(slotCount, slot);

    visibleEntries.forEach(({ el, slot }) => {
      const base = config(slot);
      let targetX = base.x * mult;
      let targetY = base.y * hM;
      let targetRot = base.rot;
      let targetScale = base.scale;
      let delay = 0;

      if (hoveredSlot !== null) {
        const distance = Math.abs(slot - hoveredSlot);
        delay = distance * 0.02;

        if (slot === hoveredSlot) {
          targetY -= 2.5 * hM;
          targetScale *= 1.08;
        } else {
          const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
          const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

          if (slot < hoveredSlot) {
            targetX -= pushStrength * mult;
            targetRot -= 3 / (distance + 1);
          } else {
            targetX += pushStrength * mult;
            targetRot += 3 / (distance + 1);
          }

          if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
          if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
        }
      } else {
        delay = Math.abs(slot - centerSlot) * 0.02;
      }

      gsap.to(el, {
        x: `${targetX}rem`,
        y: `${targetY}rem`,
        rotation: targetRot,
        scale: targetScale,
        duration: 0.5,
        delay,
        ease: 'elastic.out(1,.75)',
        overwrite: 'auto',
      });
      gsap.set(el, { zIndex: hoveredSlot === slot ? 20 : base.zIndex });
    });
  }

  function bindHoverEvents() {
    const visibleMap = getVisibleMap(centerIndex);
    activeCards.forEach((card, i) => {
      const slot = visibleMap.get(i);
      card.onmouseenter = null;
      if (slot !== undefined) {
        card.onmouseenter = () => {
          if (isAnimating) return;
          if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
          if (activeHoverSlot !== slot) {
            activeHoverSlot = slot;
            updateHoverLayout(slot);
          }
        };
      }
    });
  }

  if (container) {
    container.addEventListener('mouseleave', () => {
      if (isAnimating) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeHoverSlot = null;
        updateHoverLayout(null);
      }, 50);
    });
  }

  function cycle(dir) {
    if (isAnimating || !needsPagination) return;
    isAnimating = true;
    direction = dir;
    centerIndex = dir === 'right' 
      ? (centerIndex + 1) % totalCards 
      : (centerIndex - 1 + totalCards) % totalCards;
    updateCarousel();
  }

  // Prev / Next Button Clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cycle('left');
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cycle('right');
    });
  }

  // Department Filters
  deptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deptBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterDept = btn.getAttribute('data-dept');
      currentDept = filterDept;

      if (filterDept === 'all') {
        activeCards = [...allCards];
      } else {
        activeCards = allCards.filter(c => c.getAttribute('data-department') === filterDept);
      }

      totalCards = activeCards.length;
      needsPagination = totalCards > MAX_VISIBLE;
      centerIndex = needsPagination ? HALF : totalCards >> 1;
      direction = 'right';
      prevVisible.clear();
      updateCarousel(true);
    });
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;
  if (container) {
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) cycle('right');
        else cycle('left');
      }
    }, { passive: true });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const servicesSec = document.getElementById('services');
    if (!servicesSec) return;
    const rect = servicesSec.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowLeft') cycle('left');
      if (e.key === 'ArrowRight') cycle('right');
    }
  });

  // Window Resize handling
  window.addEventListener('resize', () => {
    if (!isAnimating) updateHoverLayout(activeHoverSlot);
  });

  // Initial Entrance Animation
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '#services',
      start: 'top 75%',
      onEnter: () => {
        if (!hasEntered) updateCarousel(true);
      },
      once: true
    });
  } else {
    updateCarousel(true);
  }
}

function initTimeline() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineLine = document.querySelector('.timeline-line');
  
  if (timelineLine) {
    // Animate the line growing
    gsap.fromTo(timelineLine, 
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        },
        transformOrigin: 'top center'
      }
    );
  }
  
  timelineItems.forEach((item, index) => {
    const direction = item.classList.contains('timeline-item--right') ? 50 : -50;
    
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: direction,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    // Animate the dot
    const dot = item.querySelector('.timeline-dot');
    if (dot) {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 75%',
        onEnter: () => {
          dot.style.borderColor = '#D4AF37';
          dot.style.boxShadow = '0 0 20px rgba(212,175,55,0.4)';
          const num = dot.querySelector('.timeline-number');
          if (num) num.style.color = '#D4AF37';
        },
        once: true
      });
    }
  });
}

function initPortfolioFilter() {
  if (typeof gsap === 'undefined') return;
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const projModal = document.getElementById('portfolioProjectsModal');
  const projModalOverlay = document.getElementById('projModalOverlay');
  const projModalClose = document.getElementById('projModalClose');
  const projModalGrid = document.getElementById('projModalGrid');
  const projModalTitle = document.getElementById('projModalTitle');
  const projModalCategory = document.getElementById('projModalCategory');
  
  if (filterBtns.length === 0 || portfolioItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      portfolioItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
            onStart: () => { item.style.display = ''; }
          });
        } else {
          gsap.to(item, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => { item.style.display = 'none'; }
          });
        }
      });
    });
  });

  function openProjectsModal(projectsData, title, category) {
    if (!projModal || !projModalGrid) return;
    
    if (projModalTitle && title) projModalTitle.textContent = title;
    if (projModalCategory && category) projModalCategory.textContent = category;
    
    projModalGrid.innerHTML = '';
    
    projectsData.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'portfolio-modal-card';
      
      const techsHtml = proj.techs ? proj.techs.map(t => `<span>${t}</span>`).join('') : '';
      
      card.innerHTML = `
        <div class="portfolio-modal-card-img-wrap">
          <img src="${proj.img}" alt="${proj.title}" class="portfolio-modal-card-img" loading="lazy">
        </div>
        <div class="portfolio-modal-card-body">
          <div>
            <span class="portfolio-modal-card-tag">${proj.category || 'Projeto Online'}</span>
            <h3 class="portfolio-modal-card-title">${proj.title}</h3>
            <p class="portfolio-modal-card-desc">${proj.desc}</p>
            ${techsHtml ? `<div class="portfolio-modal-card-techs">${techsHtml}</div>` : ''}
          </div>
          <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="portfolio-modal-card-btn">
            Acessar Projeto ↗
          </a>
        </div>
      `;
      
      projModalGrid.appendChild(card);
    });
    
    projModal.classList.add('active');
    projModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectsModal() {
    if (!projModal) return;
    projModal.classList.remove('active');
    projModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (projModalClose) projModalClose.addEventListener('click', closeProjectsModal);
  if (projModalOverlay) projModalOverlay.addEventListener('click', closeProjectsModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projModal && projModal.classList.contains('active')) {
      closeProjectsModal();
    }
  });

  // Handle direct clicks on portfolio cards
  portfolioItems.forEach(item => {
    const multiData = item.dataset.multiProjects;
    const url = item.dataset.url;
    
    if (multiData) {
      item.style.cursor = 'pointer';
      
      const handleOpen = (e) => {
        try {
          const projects = JSON.parse(multiData);
          const title = item.querySelector('h3') ? item.querySelector('h3').textContent : 'Projetos Disponíveis';
          const cat = item.querySelector('.portfolio-category') ? item.querySelector('.portfolio-category').textContent : 'Portfólio';
          openProjectsModal(projects, title, cat);
        } catch (err) {
          console.error('Erro ao processar projetos:', err);
        }
      };
      
      item.addEventListener('click', handleOpen);
      
      const btn = item.querySelector('.btn-open-multi-projects');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleOpen(e);
        });
      }
    } else if (url) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      });
    }
  });
}

function initTestimonialsCarousel() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  
  if (!track) return;
  
  const cards = track.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;

  let currentIndex = 0;
  let cardsPerView = 3;
  let autoplayInterval;
  
  function updateCardsPerView() {
    if (window.innerWidth < 768) cardsPerView = 1;
    else if (window.innerWidth < 1024) cardsPerView = 2;
    else cardsPerView = 3;
  }
  updateCardsPerView();
  window.addEventListener('resize', () => {
    updateCardsPerView();
    goTo(currentIndex);
    createDots();
  });
  
  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const numDots = Math.max(0, cards.length - cardsPerView) + 1;
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }
  createDots();
  
  function goTo(index) {
    const maxIdx = Math.max(0, cards.length - cardsPerView);
    currentIndex = Math.min(Math.max(0, index), maxIdx);
    
    // Fallback if cards or track compute poorly initially
    const cardWidth = cards[0].offsetWidth > 0 ? cards[0].offsetWidth : track.offsetWidth / cardsPerView;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const offset = -currentIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  }
  
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoplay(); });
  
  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      const maxIdx = Math.max(0, cards.length - cardsPerView);
      if (currentIndex >= maxIdx) {
        goTo(0);
      } else {
        goTo(currentIndex + 1);
      }
    }, 4000);
  }
  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }
  startAutoplay();
  
  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
      resetAutoplay();
    }
  }, { passive: true });
}

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
          const otherQuestion = other.querySelector('.faq-question');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initModal() {
  const modal = document.getElementById('quoteModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const successClose = document.getElementById('successClose');
  if (!modal) return;
  
  // Open modal triggers
  const openTriggers = document.querySelectorAll('#btnQuote, #btnQuoteCTA, .hero-buttons .btn-primary');
  
  function openModal() {
    modal.classList.add('active');
    document.body.classList.add('overflow-hidden');
    if (window.__lenis) window.__lenis.stop();
  }
  
  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
    if (window.__lenis) window.__lenis.start();
    // Reset form after close
    setTimeout(() => {
      const form = document.getElementById('quoteForm');
      const success = document.getElementById('formSuccess');
      if (form) { form.reset(); form.classList.remove('hidden'); }
      if (success) success.classList.remove('active');
      // Clear error states
      document.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
      document.querySelectorAll('.error-message').forEach(m => m.remove());
    }, 300);
  }
  
  openTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });
  
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (successClose) successClose.addEventListener('click', closeModal);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function initFormValidation() {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous errors
    form.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
    form.querySelectorAll('.error-message').forEach(m => m.remove());
    
    let isValid = true;
    
    // Validate required fields
    const name = document.getElementById('formName');
    const email = document.getElementById('formEmail');
    const service = document.getElementById('formService');
    
    if (name && !name.value.trim()) {
      showError(name, 'Por favor, insira seu nome.');
      isValid = false;
    }
    
    if (email) {
      if (!email.value.trim()) {
        showError(email, 'Por favor, insira seu email.');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Por favor, insira um email válido.');
        isValid = false;
      }
    }
    
    if (service && !service.value) {
      showError(service, 'Por favor, selecione um serviço.');
      isValid = false;
    }
    
    if (isValid) {
      // Simulate form submission
      const submitBtn = form.querySelector('.btn-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
      }
      
      setTimeout(() => {
        form.classList.add('hidden');
        const formSuccess = document.getElementById('formSuccess');
        if (formSuccess) formSuccess.classList.add('active');
        if (submitBtn) {
          submitBtn.textContent = 'Enviar Solicitação';
          submitBtn.disabled = false;
        }
      }, 1500);
    }
  });
  
  function showError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('error');
    const errorMsg = document.createElement('span');
    errorMsg.classList.add('error-message');
    errorMsg.textContent = message;
    group.appendChild(errorMsg);
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

function initMagneticButtons() {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(hover: none)').matches) return;
  
  const magneticElements = document.querySelectorAll('.magnetic');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

function initDeviceParallax() {
  if (typeof gsap === 'undefined') return;
  // Skip parallax on touch/mobile devices for better performance
  if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) return;
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;
  
  const devices = heroVisual.querySelectorAll('.device');
  if (devices.length === 0) return;
  
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    devices.forEach((device, index) => {
      const depth = (index + 1) * 8;
      gsap.to(device, {
        rotationY: x * depth,
        rotationX: -y * depth,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
  
  heroVisual.addEventListener('mouseleave', () => {
    devices.forEach(device => {
      gsap.to(device, {
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

function initContainerScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const section = document.querySelector('.container-scroll-section');
  const card = document.querySelector('.container-scroll-card');
  const header = document.querySelector('.container-scroll-header');

  if (!section || !card) return;

  const isMobile = window.innerWidth <= 768;

  // 3D Scroll Transformation (Aceternity UI replica via GSAP ScrollTrigger)
  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      end: 'bottom 40%',
      scrub: 1.2,
    }
  })
  .fromTo(card,
    {
      rotateX: isMobile ? 14 : 22,
      scale: isMobile ? 0.88 : 0.94,
      y: isMobile ? 30 : 60,
      opacity: 0.8
    },
    {
      rotateX: 0,
      scale: 1,
      y: 0,
      opacity: 1,
      ease: 'power2.out'
    },
    0
  )
  .fromTo(header,
    {
      y: 0,
      opacity: 0.9
    },
    {
      y: isMobile ? -15 : -35,
      opacity: 1,
      ease: 'power2.out'
    },
    0
  );

  // Subtle interactive 3D tilt on desktop mouse move
  if (!isMobile) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotationY: x * 6,
        rotationX: -y * 6,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  }
}

function initCurrentYear() {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

