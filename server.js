require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

app.use(express.json());
app.use(require('cors')());
app.use(express.static(path.join(__dirname)));

/* =========================================
   STRIPE CHECKOUT
   ========================================= */
const SERVICE_PRICES = {
  'AC Service & Repair': { amount: 34900, desc: 'Full system diagnosis & repair' },
  'AC Installation': { amount: 129900, desc: 'Split/window/cassette AC setup' },
  'AC Gas Refill': { amount: 219900, desc: 'R22/R410A refrigerant top-up with leak check' },
  'AC Deep Cleaning': { amount: 59900, desc: 'Jet pump cleaning for pure cool air' },
  'Annual Maintenance (AMC)': { amount: 299900, desc: 'Year-round care with 4 scheduled visits' },
  'AC Uninstallation': { amount: 49900, desc: 'Safe removal & proper gas recovery' },
  'AC Not Cooling Repair': { amount: 54900, desc: 'Full cooling diagnosis & fix' },
  'AC Water Leakage Repair': { amount: 39900, desc: 'Drain pipe unclog & leak fix' },
  'AC Noise / Vibration Fix': { amount: 44900, desc: 'Fan, motor & mount balancing' },
  'AC Compressor Repair': { amount: 149900, desc: 'Compressor diagnosis & replacement' },
  'AC PCB / Circuit Repair': { amount: 119900, desc: 'Circuit board repair & replacement' },
  'AC Fan Motor Replacement': { amount: 89900, desc: 'Blower & outdoor fan motor swap' },
  'AC Gas Leak Detection': { amount: 64900, desc: 'Nitrogen pressure & leak detection' },
  'AC Shifting / Relocation': { amount: 179900, desc: 'Full uninstall + transport + reinstall' },
  'AC Copper Pipe Fitting': { amount: 15000, desc: 'Insulated copper pipe per meter' },
  'AC Power Issue Repair': { amount: 34900, desc: 'MCB, stabilizer & wiring fix' },
  'AC Thermostat / Sensor Fix': { amount: 49900, desc: 'Sensor replacement & calibration' },
  'AC Remote + Display Repair': { amount: 29900, desc: 'Remote repair & display panel fix' }
};

app.post('/api/create-checkout-session', async (req, res) => {
  const { service, name, phone, address, date } = req.body;
  const priceData = SERVICE_PRICES[service];
  if (!priceData) {
    return res.status(400).json({ error: 'Invalid service selected.' });
  }

  const origin = req.headers.origin || `http://localhost:${PORT}`;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'upi'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: service,
            description: priceData.desc
          },
          unit_amount: priceData.amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${origin}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/index.html#booking`,
      metadata: { name, phone, service, address, date: date || 'ASAP' }
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Payment session failed. Try again.' });
  }
});

const VALID_RESOURCES = ['bookings', 'technicians', 'services', 'reviews'];

function createId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

async function readDb() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return { bookings: [], technicians: [], services: [], reviews: [] };
  }
}

async function writeDb(db) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
}

app.get('/api/public/services', async (req, res) => {
  const db = await readDb();
  res.json((db.services || []).filter(s => s.status === 'Active'));
});

app.get('/api/public/technicians', async (req, res) => {
  const db = await readDb();
  res.json((db.technicians || []).filter(t => t.status === 'Active'));
});

app.get('/api/public/reviews', async (req, res) => {
  const db = await readDb();
  res.json((db.reviews || []).filter(r => r.visibility === 'visible'));
});

app.post('/api/public/bookings', async (req, res) => {
  const booking = req.body;
  if (!booking || !booking.name || !booking.phone || !booking.service || !booking.address) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }
  const db = await readDb();
  const newBooking = {
    id: createId('booking'),
    status: 'Pending',
    createdAt: new Date().toISOString(),
    ...booking
  };
  db.bookings = db.bookings || [];
  db.bookings.push(newBooking);
  await writeDb(db);
  res.status(201).json(newBooking);
});

app.get('/api/admin/:resource', async (req, res) => {
  const { resource } = req.params;
  if (!VALID_RESOURCES.includes(resource)) {
    return res.status(404).json({ error: 'Resource not found.' });
  }
  const db = await readDb();
  res.json(db[resource] || []);
});

app.post('/api/admin/:resource', async (req, res) => {
  const { resource } = req.params;
  if (!VALID_RESOURCES.includes(resource)) {
    return res.status(404).json({ error: 'Resource not found.' });
  }
  const db = await readDb();
  const item = { id: createId(resource.slice(0, 3)), ...req.body };
  db[resource] = db[resource] || [];
  db[resource].push(item);
  await writeDb(db);
  res.status(201).json(item);
});

app.put('/api/admin/:resource/:id', async (req, res) => {
  const { resource, id } = req.params;
  if (!VALID_RESOURCES.includes(resource)) {
    return res.status(404).json({ error: 'Resource not found.' });
  }
  const db = await readDb();
  db[resource] = db[resource] || [];
  const index = db[resource].findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }
  db[resource][index] = { ...db[resource][index], ...req.body, id };
  await writeDb(db);
  res.json(db[resource][index]);
});

app.delete('/api/admin/:resource/:id', async (req, res) => {
  const { resource, id } = req.params;
  if (!VALID_RESOURCES.includes(resource)) {
    return res.status(404).json({ error: 'Resource not found.' });
  }
  const db = await readDb();
  db[resource] = db[resource] || [];
  const filtered = db[resource].filter(item => item.id !== id);
  if (filtered.length === db[resource].length) {
    return res.status(404).json({ error: 'Item not found.' });
  }
  db[resource] = filtered;
  await writeDb(db);
  res.json({ success: true });
});

app.get('/api/admin/summary', async (req, res) => {
  const db = await readDb();
  res.json({
    bookings: (db.bookings || []).length,
    technicians: (db.technicians || []).length,
    services: (db.services || []).length,
    reviews: (db.reviews || []).length
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
