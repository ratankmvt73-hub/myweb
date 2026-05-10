'use strict';

/* =========================================
   ELITE COOLING - PREMIUM ANIMATIONS
   ========================================= */

// ================== CUSTOM CURSOR ==================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, fX = 0, fY = 0;

if (!window.matchMedia('(pointer: coarse)').matches && cursor && follower) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX - 6 + 'px';
    cursor.style.top = mouseY - 6 + 'px';
  });
  function animateFollower() {
    fX += (mouseX - fX) * 0.15;
    fY += (mouseY - fY) * 0.15;
    follower.style.left = fX - 20 + 'px';
    follower.style.top = fY - 20 + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .service-opt, .service-tile, .pricing-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
} else {
  cursor?.remove(); follower?.remove();
  document.body.style.cursor = 'auto';
}

// ================== FLOATING PARTICLES ==================
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 80 + 40;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.animationDuration = (12 + Math.random() * 10) + 's';
    particlesContainer.appendChild(p);
  }
}

// ================== 3D CARD TILT ==================
document.querySelectorAll('.service-tile, .pricing-card').forEach(card => {
  card.classList.add('tilt-3d');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = (y - cy) / cy * -8;
    const ry = (x - cx) / cx * 8;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});

// ================== ENHANCED SCROLL REVEAL ==================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0) rotateX(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px) rotateX(10deg)';
  el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  revealObserver.observe(el);
});

// ================== PARALLAX HERO IMAGE ==================
window.addEventListener('scroll', () => {
  const heroImg = document.querySelector('.hero-image img');
  if (heroImg) {
    const scrollY = window.scrollY;
    heroImg.style.transform = `translateY(${scrollY * 0.15}px) scale(1.05)`;
  }
});

// ================== TYPEWRITER EFFECT ==================
document.querySelectorAll('.typewriter').forEach(el => {
  const text = el.dataset.text;
  if (!text) return;
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 30 + Math.random() * 40);
    }
  }
  setTimeout(type, 800);
});

// ================== MAGNETIC BUTTONS ==================
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// ================== TEXT SCRAMBLE ==================
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
document.querySelectorAll('.scramble-link').forEach(link => {
  const original = link.textContent;
  let interval = null;
  link.addEventListener('mouseenter', () => {
    let iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      link.textContent = original.split('').map((char, index) => {
        if (index < iteration) return original[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iteration >= original.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 30);
  });
  link.addEventListener('mouseleave', () => {
    clearInterval(interval);
    link.textContent = original;
  });
});

// ================== PRELOADER ==================
const preloader = document.getElementById('preloader');
const API_BASE_URL = window.location.protocol.startsWith('http') ? window.location.origin + '/api' : null;

window.addEventListener('load', () => {
  setTimeout(() => preloader?.classList.add('hidden'), 1400);
  loadPublicData();
});

// ================== MOBILE MENU ==================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const icon = menuToggle.querySelector('i');
  icon.className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.querySelector('i').className = 'fas fa-bars';
  });
});

// ================== NAVBAR SCROLL ==================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  if (backToTop) backToTop.classList.toggle('show', scrollY > 400);
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Old reveal observer replaced by enhanced 3D version at file top

// ================== COUNTER ANIMATION ==================
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-val'));
      const isFloat = target % 1 !== 0;
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-val]').forEach(el => counterObserver.observe(el));

function observeRevealTargets() {
  document.querySelectorAll('.reveal:not(.active)').forEach(el => revealObserver.observe(el));
}

function renderStars(count) {
  return Array.from({ length: 5 }, (_, i) => `<i class="fa${i < count ? 's' : 'r'} fa-star"></i>`).join('');
}

function renderPublicTechnicians(technicians = []) {
  const container = document.getElementById('techShowcase');
  if (!container) return;
  const activeTechs = technicians.filter(t => t.status === 'Active');
  if (!activeTechs.length) {
    container.innerHTML = '<p class="section-desc" style="text-align:center; grid-column:1/-1">Technicians will appear here once added in Admin.</p>';
    return;
  }
  container.innerHTML = activeTechs.map(t => `
    <article class="tech-profile reveal">
      <div class="tech-avatar">${t.name.charAt(0).toUpperCase()}</div>
      <h4>${t.name}</h4>
      <span class="specialty">${t.specialization || 'AC Services'}</span>
      <div class="tech-rating">${renderStars(Math.min(5, Math.max(3, Math.round((t.experience || 2) / 2))))}</div>
      <p class="tech-desc">${t.notes || 'Reliable AC technician with fast response.'}</p>
      <div class="tech-stats">
        <div class="ts-item"><strong>${t.experience || 0} yrs</strong><span>Experience</span></div>
        <div class="ts-item"><strong>${t.area || 'Ahmedabad'}</strong><span>Service Area</span></div>
      </div>
    </article>
  `).join('');
  observeRevealTargets();
}

function renderPublicReviews(reviews = []) {
  const container = document.getElementById('reviewsShowcase');
  if (!container) return;
  const visibleReviews = reviews.filter(r => r.visibility === 'visible');
  if (!visibleReviews.length) {
    container.innerHTML = '<p class="section-desc" style="text-align:center; grid-column:1/-1">Customer reviews will appear here once added in Admin.</p>';
    return;
  }
  container.innerHTML = visibleReviews.map(r => `
    <article class="review-card reveal">
      <div class="review-stars">${renderStars(r.rating)}</div>
      <p class="review-text">${r.text}</p>
      <div class="reviewer"><strong>${r.name}</strong><span>${r.location || 'Ahmedabad'}</span></div>
    </article>
  `).join('');
  observeRevealTargets();
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}

function getAdminDb() {
  const raw = localStorage.getItem('ec_admin_db');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (err) { return null; }
}

function saveAdminDb(data) {
  localStorage.setItem('ec_admin_db', JSON.stringify(data));
}

function renderPublicServices(services = []) {
  const container = document.getElementById('publicServiceTiles');
  if (!container) return;
  const activeServices = services.filter(s => s.status === 'Active');
  if (!activeServices.length) {
    container.innerHTML = '<p class="section-desc" style="text-align:center; grid-column:1/-1">Services will appear here once added in Admin.</p>';
    return;
  }
  const iconMap = {
    Repair: 'fas fa-tools', Installation: 'fas fa-screwdriver-wrench', Cleaning: 'fas fa-broom', 'Gas Refill': 'fas fa-droplet', Maintenance: 'fas fa-calendar-check', Other: 'fas fa-wrench'
  };
  container.innerHTML = activeServices.map(s => `
    <div class="service-tile reveal">
      <div class="tile-img"><i class="${iconMap[s.category] || 'fas fa-wrench'} fa-2x" style="color: var(--orange);"></i></div>
      <div class="tile-body">
        <h4>${s.name}</h4>
        <p>${s.description || 'Professional service with transparent pricing.'}</p>
        <div class="tile-price">From <b>Rs. ${s.price.toLocaleString()}</b></div>
        <a href="#booking" class="tile-btn">Book Now</a>
      </div>
    </div>
  `).join('');
  observeRevealTargets();
}

function renderPublicPricing(services = []) {
  const container = document.getElementById('publicPricingGrid');
  if (!container) return;
  const activeServices = services.filter(s => s.status === 'Active');
  if (!activeServices.length) {
    container.innerHTML = '<p class="section-desc" style="text-align:center; grid-column:1/-1">Pricing cards will appear here once services are added in Admin.</p>';
    return;
  }
  const badges = ['Popular', 'Best Value', 'Premium', 'Refill', 'Repair', 'Leak Fix'];
  container.innerHTML = activeServices.map((s, index) => `
    <div class="price-card reveal ${index === 1 ? 'featured' : ''}">
      <div class="price-badge">${badges[index % badges.length]}</div>
      <h4>${s.name}</h4>
      <div class="price-amount">Rs. <span>${s.price.toLocaleString()}</span></div>
      <ul class="price-features">
        <li><i class="fas fa-check"></i>${s.description || 'Top-quality service'}</li>
        <li><i class="fas fa-check"></i>Transparent rate</li>
        <li><i class="fas fa-check"></i>Skilled technician</li>
        <li><i class="fas fa-check"></i>30-day warranty</li>
      </ul>
      <a href="#booking" class="price-btn">Book Now</a>
    </div>
  `).join('');
  observeRevealTargets();
}

function populateBookingServices(services = []) {
  const select = document.getElementById('service');
  if (!select) return;
  const activeServices = services.filter(s => s.status === 'Active');
  if (!activeServices.length) return;
  select.innerHTML = '<option value="">Select Service</option>' +
    activeServices.map(s => `<option>${s.name}</option>`).join('');
}

function saveBookingToAdminDB(booking) {
  const db = getAdminDb() || { bookings: [], technicians: [], services: [], reviews: [] };
  if (!Array.isArray(db.bookings)) db.bookings = [];
  db.bookings.push(booking);
  saveAdminDb(db);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function loadPublicData() {
  const fallbackDb = getAdminDb();
  if (!API_BASE_URL) {
    if (fallbackDb) {
      renderPublicTechnicians(fallbackDb.technicians || []);
      renderPublicReviews(fallbackDb.reviews || []);
      renderPublicServices(fallbackDb.services || []);
      renderPublicPricing(fallbackDb.services || []);
      populateBookingServices(fallbackDb.services || []);
    }
    return;
  }

  try {
    const [services, technicians, reviews] = await Promise.all([
      fetchJson(`${API_BASE_URL}/public/services`),
      fetchJson(`${API_BASE_URL}/public/technicians`),
      fetchJson(`${API_BASE_URL}/public/reviews`)
    ]);
    renderPublicTechnicians(technicians || []);
    renderPublicReviews(reviews || []);
    renderPublicServices(services || []);
    renderPublicPricing(services || []);
    populateBookingServices(services || []);
  } catch (err) {
    console.warn('Could not load public API, falling back to local admin DB.', err);
    if (fallbackDb) {
      renderPublicTechnicians(fallbackDb.technicians || []);
      renderPublicReviews(fallbackDb.reviews || []);
      renderPublicServices(fallbackDb.services || []);
      renderPublicPricing(fallbackDb.services || []);
      populateBookingServices(fallbackDb.services || []);
    }
  }
}

// ================== FAQ ACCORDION ==================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// ================== SCROLL TO BOOKING ==================
function scrollToBooking() {
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
}

// ================== WHATSAPP FORM ==================
const NARAYAN_WA = '919106915331';
let currentCoords = null;
document.getElementById('whatsapp-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('date')?.value || 'ASAP';
  const address = document.getElementById('address').value.trim();

  let text = `ELITE COOLING - NEW BOOKING%0A%0A` +
    `*Name:* ${encodeURIComponent(name)}%0A` +
    `*Phone:* ${encodeURIComponent(phone)}%0A` +
    `*Service:* ${encodeURIComponent(service)}%0A` +
    `*Preferred Date:* ${encodeURIComponent(date)}%0A` +
    `*Address:* ${encodeURIComponent(address)}`;
  
  if (currentCoords) {
    text += `%0AMap Link: https://www.google.com/maps?q=${currentCoords.latitude},${currentCoords.longitude}`;
  }
  
  text += `%0A%0A(Sent via EliteCooling.com)`;

  const btn = e.target.querySelector('.btn-submit');
  const originalText = btn.innerText;
  btn.innerText = 'Processing...';
  btn.disabled = true;

  const bookingPayload = {
    name,
    phone,
    service,
    date,
    address,
    coords: currentCoords,
    source: 'Website Booking Form'
  };

  const saveFallback = () => {
    saveBookingToAdminDB({
      id: generateId('booking'),
      ...bookingPayload,
      status: 'Pending',
      createdAt: new Date().toISOString()
    });
  };

  const finish = () => {
    btn.innerText = 'Sent! Check WhatsApp';
    btn.style.background = '#25D366';
    e.target.reset();
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  };

  const openWhatsApp = () => {
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
    const waWebUrl = `https://wa.me/${NARAYAN_WA}?text=${text}`;
    const waAppUrl = `https://api.whatsapp.com/send?phone=${NARAYAN_WA}&text=${text}`;
    if (isMobile) window.location.href = waAppUrl;
    else window.open(waWebUrl, '_blank');
  };

  if (API_BASE_URL) {
    fetch(`${API_BASE_URL}/public/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    })
      .then(response => {
        if (!response.ok) throw new Error('Booking API failed');
        return response.json();
      })
      .then(() => {
        openWhatsApp();
        finish();
      })
      .catch(() => {
        saveFallback();
        openWhatsApp();
        finish();
      });
  } else {
    saveFallback();
    openWhatsApp();
    finish();
  }
});

// ================== GEOLOCATION ==================
const locationBtn = document.getElementById('getLocation');
const addressField = document.getElementById('address');

locationBtn?.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }

  locationBtn.classList.add('loading');
  locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      currentCoords = { latitude, longitude };
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();
        if (data && data.display_name) {
          addressField.value = data.display_name;
        } else {
          addressField.value = `Location: ${latitude}, ${longitude}`;
        }
      } catch (error) {
        // Fallback to coordinates if API fails
        addressField.value = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)} (https://www.google.com/maps?q=${latitude},${longitude})`;
      } finally {
        locationBtn.classList.remove('loading');
        locationBtn.innerHTML = '<i class="fas fa-check"></i> Location Set';
        // Focus the address field so user can refine it
        addressField.focus();
        setTimeout(() => {
          locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
        }, 3000);
      }
    },
    (error) => {
      locationBtn.classList.remove('loading');
      let msg = 'Could not get location.';
      if (error.code === 1) msg = 'Location access denied. Please enable it in browser.';
      else if (error.code === 2) msg = 'Location unavailable.';
      else if (error.code === 3) msg = 'Location request timed out.';
      
      alert(msg);
      locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
});

// ================== RAZORPAY PAY ONLINE ==================
document.getElementById('btnPayOnline')?.addEventListener('click', async () => {
  const form = document.getElementById('whatsapp-form');
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('date')?.value || 'ASAP';
  const address = document.getElementById('address').value.trim();

  if (!name || !phone || !service || !address) {
    alert('Please fill Name, Phone, Service and Address first.');
    form.querySelector('[required]:invalid')?.focus();
    return;
  }

  const btn = document.getElementById('btnPayOnline');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Payment...';

  try {
    const apiBase = window.location.protocol.startsWith('http') ? window.location.origin : '';
    const res = await fetch(`${apiBase}/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, service, address, date })
    });
    const data = await res.json();
    
    if (data.key_id && data.order_id) {
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: data.name,
        description: data.description,
        order_id: data.order_id,
        handler: function(response) {
          localStorage.setItem('ec_service', service);
          localStorage.setItem('ec_amount', (data.amount / 100).toString());
          window.location.href = '/payment-success.html?payment_id=' + response.razorpay_payment_id;
        },
        prefill: {
          name: name,
          contact: phone
        },
        theme: {
          color: '#2563eb'
        }
      };
      const rzp = new Razorpay(options);
      rzp.open();
    } else {
      throw new Error(data.error || 'Payment session failed');
    }
  } catch (err) {
    alert('Payment failed: ' + err.message);
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-credit-card"></i> Pay Securely & Book Online';
  }
});

// ================== SERVICE CARD SELECTOR ==================
document.querySelectorAll('.service-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.service-opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    document.getElementById('service').value = opt.dataset.value;
    localStorage.setItem('ec_amount', 'Rs. ' + opt.dataset.price);
  });
});
