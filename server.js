const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Local data stores
const mockUsers = []; // Stores objects like: { email, password }
const mockSessions = [];

// 1. Classic Email Registration Endpoint
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  const userExists = mockUsers.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ success: false, message: "This email is already registered!" });
  }

  const newUser = { email, password };
  mockUsers.push(newUser);
  console.log("👤 New Email User Registered:", newUser);

  res.status(201).json({ success: true, message: "Account created successfully!" });
});

// 2. Classic Email Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  console.log("✅ User logged in successfully:", email);
  res.status(200).json({ success: true, user: { email: user.email } });
});

// 3. Save Session Telemetry
app.post('/api/sessions', (req, res) => {
  mockSessions.push(req.body);
  console.log("📁 Telemetry Session synced:", req.body);
  res.status(201).json({ success: true, message: "Tracker saved successfully." });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Classic Email server running on port ${PORT}`);
});