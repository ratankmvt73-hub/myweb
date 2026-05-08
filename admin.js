'use strict';
/* =========================================
   ELITE COOLING - ADMIN PANEL JS
   Full CRUD via localStorage
   ========================================= */

// ============ AUTH ============
const ADMIN_CREDS = { user: 'admin', pass: 'elitecooling@2026' };

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  if (u === ADMIN_CREDS.user && p === ADMIN_CREDS.pass) {
    localStorage.setItem('ec_admin_auth', '1');
    showApp();
  } else {
    document.getElementById('loginError').textContent = 'Invalid username or password.';
  }
});

function togglePass() {
  const inp = document.getElementById('loginPass');
  const icon = document.getElementById('eyeIcon');
  if (inp.type === 'password') { inp.type = 'text'; icon.className = 'fas fa-eye-slash'; }
  else { inp.type = 'password'; icon.className = 'fas fa-eye'; }
}

function showApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminApp').classList.remove('hidden');
  loadAllData();
  updateDashboard();
}

function logout() {
  localStorage.removeItem('ec_admin_auth');
  location.reload();
}

document.getElementById('logoutBtn').addEventListener('click', logout);

// Auto-login if already authenticated
if (localStorage.getItem('ec_admin_auth') === '1') showApp();

// ============ SIDEBAR TOGGLE ============
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ============ NAVIGATION ============
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const pg = item.dataset.page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pg).classList.add('active');
    document.getElementById('pageTitle').textContent = item.querySelector('span').textContent;
    if (pg === 'dashboard') updateDashboard();
    if (pg === 'bookings') renderBookings();
    if (pg === 'technicians') renderTechnicians();
    if (pg === 'services') renderServices();
    if (pg === 'reviews') renderReviews();
    // Close sidebar on mobile
    if (window.innerWidth < 768) document.getElementById('sidebar').classList.remove('open');
  });
});

// ============ DATA STORE ============
let DB = { bookings: [], technicians: [], services: [], reviews: [] };

function save() { localStorage.setItem('ec_admin_db', JSON.stringify(DB)); }
function loadAllData() {
  const raw = localStorage.getItem('ec_admin_db');
  if (raw) {
    DB = JSON.parse(raw);
  } else {
    // Seed default data
    DB.technicians = [
      { id: uid(), name: 'Narayan Kumar', phone: '9106915331', specialization: 'All Services', experience: 8, area: 'All Ahmedabad', status: 'Active', notes: 'Owner & Lead Technician' },
      { id: uid(), name: 'Ramesh Meena', phone: '9876543210', specialization: 'AC Repair & Service', experience: 5, area: 'Memnagar, Ahmedabad', status: 'Active', notes: '' },
    ];
    DB.services = [
      { id: uid(), name: 'AC Service & Repair', price: 349, description: 'Complete diagnosis & repair', category: 'Repair', status: 'Active' },
      { id: uid(), name: 'AC Installation', price: 1299, description: 'Split, window & cassette setup', category: 'Installation', status: 'Active' },
      { id: uid(), name: 'AC Gas Refill', price: 2199, description: 'R22/R410A refrigerant top-up', category: 'Gas Refill', status: 'Active' },
      { id: uid(), name: 'AC Deep Cleaning', price: 599, description: 'Jet pump cleaning', category: 'Cleaning', status: 'Active' },
      { id: uid(), name: 'Annual Maintenance (AMC)', price: 2999, description: 'Year-round care, 4 visits', category: 'Maintenance', status: 'Active' },
    ];
    DB.reviews = [
      { id: uid(), name: 'Rajesh Sharma', location: 'Nikol, Ahmedabad', rating: 5, service: 'AC Service & Repair', text: 'Excellent service! Technician arrived on time and my AC is cooling like new.', visibility: 'visible' },
      { id: uid(), name: 'Priya Gupta', location: 'Bodakdev, Ahmedabad', rating: 5, service: 'AC Gas Refill', text: 'Best AC gas refill in Ahmedabad. Fair pricing, no hidden charges.', visibility: 'visible' },
    ];
    DB.bookings = [];
    save();
  }
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

// ============ TOAST ============
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 2800);
}

// ============ MODAL ============
let activeModal = null;
function openModal(id) {
  document.getElementById('modalOverlay').classList.add('open');
  const m = document.getElementById('modal-' + id);
  m.style.display = 'block';
  setTimeout(() => m.classList.add('open'), 10);
  activeModal = id;
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.querySelectorAll('.modal').forEach(m => { m.classList.remove('open'); setTimeout(() => m.style.display = 'none', 280); });
  activeModal = null;
}

// ============ BADGE ============
function badge(val, map) {
  const cls = map[val] || 'badge';
  return `<span class="badge ${cls}">${val}</span>`;
}
const statusMap = { Pending: 'badge-pending', Confirmed: 'badge-confirmed', Completed: 'badge-completed', Cancelled: 'badge-cancelled', Active: 'badge-active', Blocked: 'badge-blocked', Inactive: 'badge-inactive', visible: 'badge-visible', hidden: 'badge-hidden' };

function stars(n) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += `<i class="fa${i <= n ? 's' : 'r'} fa-star"></i>`;
  return s;
}

// ============ DASHBOARD ============
function updateDashboard() {
  document.getElementById('stat-bookings').textContent = DB.bookings.length;
  document.getElementById('stat-techs').textContent = DB.technicians.length;
  document.getElementById('stat-services').textContent = DB.services.length;
  document.getElementById('stat-reviews').textContent = DB.reviews.length;
  document.getElementById('stat-blocked').textContent = DB.technicians.filter(t => t.status === 'Blocked').length;

  // Recent bookings
  const rb = document.getElementById('recentBookings');
  if (!DB.bookings.length) { rb.innerHTML = '<p class="empty-msg">No bookings yet.</p>'; }
  else {
    rb.innerHTML = DB.bookings.slice(-5).reverse().map(b =>
      `<div class="recent-booking-row">
        <div class="rbr-info"><strong>${esc(b.name)}</strong><span>${esc(b.service)}</span></div>
        ${badge(b.status, statusMap)}
      </div>`
    ).join('');
  }

  // Tech status
  const tl = document.getElementById('techStatusList');
  if (!DB.technicians.length) { tl.innerHTML = '<p class="empty-msg">No technicians yet.</p>'; }
  else {
    tl.innerHTML = DB.technicians.map(t =>
      `<div class="tech-status-row">
        <div><div class="tsr-name">${esc(t.name)}</div><div class="tsr-detail">${esc(t.area)}</div></div>
        ${badge(t.status, statusMap)}
      </div>`
    ).join('');
  }
}

// ============ BOOKINGS ============
function renderBookings() {
  const q = document.getElementById('searchBooking').value.toLowerCase();
  const sf = document.getElementById('filterBookingStatus').value;
  const rows = DB.bookings.filter(b =>
    (!sf || b.status === sf) &&
    (!q || b.name.toLowerCase().includes(q) || b.phone.includes(q) || b.service.toLowerCase().includes(q))
  );
  const tbody = document.getElementById('bookingsBody');
  if (!rows.length) { tbody.innerHTML = `<tr><td colspan="9" class="empty-msg">No bookings found.</td></tr>`; return; }
  tbody.innerHTML = rows.map((b, i) => {
    const tech = DB.technicians.find(t => t.id === b.techId);
    return `<tr>
      <td>${i + 1}</td>
      <td><strong>${esc(b.name)}</strong></td>
      <td>${esc(b.phone)}</td>
      <td>${esc(b.service)}</td>
      <td>${b.date || '—'}</td>
      <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(b.address)}">${esc(b.address)}</td>
      <td>${badge(b.status, statusMap)}</td>
      <td>${tech ? esc(tech.name) : '<span style="color:var(--text-muted)">Unassigned</span>'}</td>
      <td><div class="action-btns">
        <button class="btn-icon btn-icon-edit" title="Edit" onclick="editBooking('${b.id}')"><i class="fas fa-pen"></i></button>
        <button class="btn-icon btn-icon-delete" title="Delete" onclick="confirmDelete('booking','${b.id}')"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`;
  }).join('');
}

function openAddBookingModal() {
  document.getElementById('bookingModalTitle').textContent = 'Add Booking';
  document.getElementById('editBookingId').value = '';
  ['bName','bPhone','bAddress','bNotes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('bService').value = '';
  document.getElementById('bDate').value = '';
  document.getElementById('bStatus').value = 'Pending';
  populateTechSelect();
  openModal('addBooking');
}

function populateTechSelect(selectedId = '') {
  const sel = document.getElementById('bTech');
  sel.innerHTML = '<option value="">Unassigned</option>' +
    DB.technicians.filter(t => t.status === 'Active').map(t =>
      `<option value="${t.id}" ${t.id === selectedId ? 'selected' : ''}>${esc(t.name)}</option>`
    ).join('');
}

function editBooking(id) {
  const b = DB.bookings.find(x => x.id === id);
  if (!b) return;
  document.getElementById('bookingModalTitle').textContent = 'Edit Booking';
  document.getElementById('editBookingId').value = b.id;
  document.getElementById('bName').value = b.name;
  document.getElementById('bPhone').value = b.phone;
  document.getElementById('bService').value = b.service;
  document.getElementById('bDate').value = b.date;
  document.getElementById('bAddress').value = b.address;
  document.getElementById('bStatus').value = b.status;
  document.getElementById('bNotes').value = b.notes || '';
  populateTechSelect(b.techId);
  openModal('addBooking');
}

function saveBooking() {
  const id = document.getElementById('editBookingId').value;
  const name = document.getElementById('bName').value.trim();
  const phone = document.getElementById('bPhone').value.trim();
  const service = document.getElementById('bService').value;
  if (!name || !phone || !service) { toast('Please fill required fields.', 'error'); return; }
  const obj = {
    id: id || uid(), name, phone, service,
    date: document.getElementById('bDate').value,
    address: document.getElementById('bAddress').value.trim(),
    status: document.getElementById('bStatus').value,
    techId: document.getElementById('bTech').value,
    notes: document.getElementById('bNotes').value.trim(),
    createdAt: id ? undefined : new Date().toISOString()
  };
  if (id) {
    const idx = DB.bookings.findIndex(x => x.id === id);
    if (idx > -1) { DB.bookings[idx] = { ...DB.bookings[idx], ...obj }; }
  } else {
    DB.bookings.push(obj);
  }
  save(); closeModal(); renderBookings(); updateDashboard();
  toast(id ? 'Booking updated!' : 'Booking added!');
}

// ============ TECHNICIANS ============
function renderTechnicians() {
  const q = document.getElementById('searchTech').value.toLowerCase();
  const sf = document.getElementById('filterTechStatus').value;
  const list = DB.technicians.filter(t =>
    (!sf || t.status === sf) &&
    (!q || t.name.toLowerCase().includes(q) || t.phone.includes(q) || t.area.toLowerCase().includes(q))
  );
  const container = document.getElementById('techCards');
  if (!list.length) { container.innerHTML = '<p class="empty-msg" style="grid-column:1/-1">No technicians found.</p>'; return; }
  container.innerHTML = list.map(t => `
    <div class="tech-card ${t.status === 'Blocked' ? 'blocked-card' : ''}">
      <div class="tech-card-status">${badge(t.status, statusMap)}</div>
      <div class="tech-avatar">${t.name.charAt(0).toUpperCase()}</div>
      <h4>${esc(t.name)}</h4>
      <div class="tech-spec">${esc(t.specialization)}</div>
      <div class="tech-meta">
        <span><i class="fas fa-phone"></i>${esc(t.phone)}</span>
        <span><i class="fas fa-map-marker-alt"></i>${esc(t.area)}</span>
        <span><i class="fas fa-briefcase"></i>${t.experience} yrs experience</span>
        ${t.notes ? `<span><i class="fas fa-sticky-note"></i>${esc(t.notes)}</span>` : ''}
      </div>
      <div class="tech-card-actions">
        <button class="btn-icon btn-icon-edit" title="Edit" onclick="editTechnician('${t.id}')"><i class="fas fa-pen"></i></button>
        ${t.status === 'Active'
          ? `<button class="btn-icon btn-icon-block" title="Block" onclick="toggleTechStatus('${t.id}','Blocked')"><i class="fas fa-ban"></i></button>`
          : `<button class="btn-icon btn-icon-unblock" title="Unblock" onclick="toggleTechStatus('${t.id}','Active')"><i class="fas fa-check"></i></button>`
        }
        <button class="btn-icon btn-icon-delete" title="Delete" onclick="confirmDelete('technician','${t.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function openAddTechModal() {
  document.getElementById('techModalTitle').textContent = 'Add Technician';
  document.getElementById('editTechId').value = '';
  ['tName','tPhone','tExp','tArea','tNotes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('tSpecialization').value = 'All Services';
  document.getElementById('tStatus').value = 'Active';
  openModal('addTech');
}

function editTechnician(id) {
  const t = DB.technicians.find(x => x.id === id);
  if (!t) return;
  document.getElementById('techModalTitle').textContent = 'Edit Technician';
  document.getElementById('editTechId').value = t.id;
  document.getElementById('tName').value = t.name;
  document.getElementById('tPhone').value = t.phone;
  document.getElementById('tSpecialization').value = t.specialization;
  document.getElementById('tExp').value = t.experience;
  document.getElementById('tArea').value = t.area;
  document.getElementById('tStatus').value = t.status;
  document.getElementById('tNotes').value = t.notes || '';
  openModal('addTech');
}

function saveTechnician() {
  const id = document.getElementById('editTechId').value;
  const name = document.getElementById('tName').value.trim();
  const phone = document.getElementById('tPhone').value.trim();
  if (!name || !phone) { toast('Name and phone are required.', 'error'); return; }
  const obj = {
    id: id || uid(), name, phone,
    specialization: document.getElementById('tSpecialization').value,
    experience: parseInt(document.getElementById('tExp').value) || 0,
    area: document.getElementById('tArea').value.trim(),
    status: document.getElementById('tStatus').value,
    notes: document.getElementById('tNotes').value.trim()
  };
  if (id) {
    const idx = DB.technicians.findIndex(x => x.id === id);
    if (idx > -1) DB.technicians[idx] = obj;
  } else {
    DB.technicians.push(obj);
  }
  save(); closeModal(); renderTechnicians(); updateDashboard();
  toast(id ? 'Technician updated!' : 'Technician added!');
}

function toggleTechStatus(id, status) {
  const idx = DB.technicians.findIndex(x => x.id === id);
  if (idx > -1) { DB.technicians[idx].status = status; save(); renderTechnicians(); updateDashboard(); }
  toast(status === 'Blocked' ? 'Technician blocked.' : 'Technician activated!', status === 'Blocked' ? 'error' : 'success');
}

// ============ SERVICES ============
function renderServices() {
  const q = document.getElementById('searchService').value.toLowerCase();
  const list = DB.services.filter(s => !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  const tbody = document.getElementById('servicesBody');
  if (!list.length) { tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">No services found.</td></tr>`; return; }
  tbody.innerHTML = list.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${esc(s.name)}</strong><br><small style="color:var(--text-muted)">${esc(s.category)}</small></td>
      <td><strong style="color:var(--orange)">Rs. ${s.price.toLocaleString()}</strong></td>
      <td style="max-width:200px;color:var(--text-secondary);font-size:0.85rem">${esc(s.description)}</td>
      <td>${badge(s.status, statusMap)}</td>
      <td><div class="action-btns">
        <button class="btn-icon btn-icon-edit" onclick="editService('${s.id}')"><i class="fas fa-pen"></i></button>
        <button class="btn-icon btn-icon-delete" onclick="confirmDelete('service','${s.id}')"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}

function openAddServiceModal() {
  document.getElementById('serviceModalTitle').textContent = 'Add Service';
  document.getElementById('editServiceId').value = '';
  ['sName','sPrice','sDesc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('sCategory').value = 'Repair';
  document.getElementById('sStatus').value = 'Active';
  openModal('addService');
}

function editService(id) {
  const s = DB.services.find(x => x.id === id);
  if (!s) return;
  document.getElementById('serviceModalTitle').textContent = 'Edit Service';
  document.getElementById('editServiceId').value = s.id;
  document.getElementById('sName').value = s.name;
  document.getElementById('sPrice').value = s.price;
  document.getElementById('sDesc').value = s.description;
  document.getElementById('sCategory').value = s.category;
  document.getElementById('sStatus').value = s.status;
  openModal('addService');
}

function saveService() {
  const id = document.getElementById('editServiceId').value;
  const name = document.getElementById('sName').value.trim();
  const price = parseInt(document.getElementById('sPrice').value);
  if (!name || isNaN(price)) { toast('Name and price are required.', 'error'); return; }
  const obj = {
    id: id || uid(), name, price,
    description: document.getElementById('sDesc').value.trim(),
    category: document.getElementById('sCategory').value,
    status: document.getElementById('sStatus').value
  };
  if (id) {
    const idx = DB.services.findIndex(x => x.id === id);
    if (idx > -1) DB.services[idx] = obj;
  } else {
    DB.services.push(obj);
  }
  save(); closeModal(); renderServices(); updateDashboard();
  toast(id ? 'Service updated!' : 'Service added!');
}

// ============ REVIEWS ============
function renderReviews() {
  const grid = document.getElementById('reviewsAdminGrid');
  if (!DB.reviews.length) { grid.innerHTML = '<p class="empty-msg" style="grid-column:1/-1">No reviews yet.</p>'; return; }
  grid.innerHTML = DB.reviews.map(r => `
    <div class="review-admin-card">
      <div class="rev-card-top">
        <div class="rev-stars">${stars(r.rating)}</div>
        ${badge(r.visibility, statusMap)}
      </div>
      <div class="rev-text">"${esc(r.text)}"</div>
      <div class="rev-meta">
        <strong>${esc(r.name)}</strong>
        <span><i class="fas fa-map-marker-alt" style="color:var(--orange);margin-right:4px"></i>${esc(r.location)}</span>
        <span style="color:var(--text-muted);font-size:0.78rem">${esc(r.service)}</span>
      </div>
      <div class="rev-actions">
        <button class="btn-icon btn-icon-edit" onclick="editReview('${r.id}')"><i class="fas fa-pen"></i></button>
        <button class="btn-icon ${r.visibility === 'visible' ? 'btn-icon-block' : 'btn-icon-unblock'}" onclick="toggleReviewVisibility('${r.id}')" title="${r.visibility === 'visible' ? 'Hide' : 'Show'}">
          <i class="fas fa-${r.visibility === 'visible' ? 'eye-slash' : 'eye'}"></i>
        </button>
        <button class="btn-icon btn-icon-delete" onclick="confirmDelete('review','${r.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function openAddReviewModal() {
  document.getElementById('reviewModalTitle').textContent = 'Add Review';
  document.getElementById('editReviewId').value = '';
  ['rName','rLocation','rText'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('rRating').value = 5;
  document.getElementById('rService').value = 'AC Service & Repair';
  document.getElementById('rVisible').value = 'visible';
  openModal('addReview');
}

function editReview(id) {
  const r = DB.reviews.find(x => x.id === id);
  if (!r) return;
  document.getElementById('reviewModalTitle').textContent = 'Edit Review';
  document.getElementById('editReviewId').value = r.id;
  document.getElementById('rName').value = r.name;
  document.getElementById('rLocation').value = r.location;
  document.getElementById('rRating').value = r.rating;
  document.getElementById('rService').value = r.service;
  document.getElementById('rText').value = r.text;
  document.getElementById('rVisible').value = r.visibility;
  openModal('addReview');
}

function saveReview() {
  const id = document.getElementById('editReviewId').value;
  const name = document.getElementById('rName').value.trim();
  const text = document.getElementById('rText').value.trim();
  if (!name || !text) { toast('Name and review text are required.', 'error'); return; }
  const obj = {
    id: id || uid(), name, text,
    location: document.getElementById('rLocation').value.trim(),
    rating: parseInt(document.getElementById('rRating').value) || 5,
    service: document.getElementById('rService').value,
    visibility: document.getElementById('rVisible').value
  };
  if (id) {
    const idx = DB.reviews.findIndex(x => x.id === id);
    if (idx > -1) DB.reviews[idx] = obj;
  } else {
    DB.reviews.push(obj);
  }
  save(); closeModal(); renderReviews();
  toast(id ? 'Review updated!' : 'Review added!');
}

function toggleReviewVisibility(id) {
  const idx = DB.reviews.findIndex(x => x.id === id);
  if (idx > -1) {
    DB.reviews[idx].visibility = DB.reviews[idx].visibility === 'visible' ? 'hidden' : 'visible';
    save(); renderReviews();
    toast('Visibility updated!');
  }
}

// ============ DELETE ============
let _deleteTarget = null;
function confirmDelete(type, id) {
  const labels = { booking: 'booking', technician: 'technician', service: 'service', review: 'review' };
  document.getElementById('deleteConfirmMsg').textContent = `Are you sure you want to delete this ${labels[type]}? This cannot be undone.`;
  _deleteTarget = { type, id };
  document.getElementById('deleteConfirmBtn').onclick = executeDelete;
  openModal('confirmDelete');
}

function executeDelete() {
  if (!_deleteTarget) return;
  const { type, id } = _deleteTarget;
  const key = type === 'booking' ? 'bookings' : type === 'technician' ? 'technicians' : type === 'service' ? 'services' : 'reviews';
  DB[key] = DB[key].filter(x => x.id !== id);
  save(); closeModal(); _deleteTarget = null;
  if (type === 'booking') { renderBookings(); updateDashboard(); }
  if (type === 'technician') { renderTechnicians(); updateDashboard(); }
  if (type === 'service') renderServices();
  if (type === 'review') renderReviews();
  toast('Deleted successfully.', 'error');
}

// ============ BUTTON OVERRIDES (from HTML onclick) ============
window.openModal = openModal;
window.closeModal = closeModal;
window.editBooking = editBooking;
window.editTechnician = editTechnician;
window.editService = editService;
window.editReview = editReview;
window.saveTechnician = saveTechnician;
window.saveBooking = saveBooking;
window.saveService = saveService;
window.saveReview = saveReview;
window.confirmDelete = confirmDelete;
window.toggleTechStatus = toggleTechStatus;
window.toggleReviewVisibility = toggleReviewVisibility;
window.togglePass = togglePass;

// Add buttons wired through onclick in html
document.querySelector('[onclick="openModal(\'addBooking\')"]')?.addEventListener('click', openAddBookingModal);
document.querySelector('[onclick="openModal(\'addTech\')"]')?.addEventListener('click', e => { e.stopPropagation(); openAddTechModal(); });
document.querySelector('[onclick="openModal(\'addService\')"]')?.addEventListener('click', e => { e.stopPropagation(); openAddServiceModal(); });
document.querySelector('[onclick="openModal(\'addReview\')"]')?.addEventListener('click', e => { e.stopPropagation(); openAddReviewModal(); });

// Override onclick add buttons
document.querySelectorAll('.btn-add').forEach(btn => {
  const oc = btn.getAttribute('onclick');
  if (oc && oc.includes('addBooking')) btn.onclick = openAddBookingModal;
  if (oc && oc.includes('addTech')) btn.onclick = openAddTechModal;
  if (oc && oc.includes('addService')) btn.onclick = openAddServiceModal;
  if (oc && oc.includes('addReview')) btn.onclick = openAddReviewModal;
});

// ============ ESCAPE HELPER ============
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
