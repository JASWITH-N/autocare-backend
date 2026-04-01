import fetch from 'node-fetch'; // Polyfill if needed

// In Node v18+, fetch is natively available
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: "Live Registration Test",
    email: "jaswithnimmala1811+" + Date.now() + "@gmail.com",
    username: "livetest" + Date.now(),
    password: "password123",
    role: "customer"
  })
}).then(async r => {
  const json = await r.json();
  console.log('API Status:', r.status);
  console.log('API Response:', json);
}).catch(console.error);
