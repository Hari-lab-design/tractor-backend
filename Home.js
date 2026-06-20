import React, { useState, useEffect, useRef } from 'react';

const CULTIVATORS = [
  { id: 1, name: "Spring Kalappai", rate: 900, img: "/spring.png", hp: "45 HP", type: "Heavy Duty" },
  { id: 2, name: "5 Kalappai", rate: 1000, img: "/5 kalappi.png", hp: "50 HP", type: "Standard" },
  { id: 3, name: "Rotavator", rate: 1100, img: "/rotavator.png", hp: "60 HP", type: "Premium tillage" },
  { id: 4, name: "Disc Harrow", rate: 1500, img: "💿", hp: "55 HP", type: "Disking" },
  { id: 5, name: "Trailer / Tipper", rate: 500, img: "/trailler.png", hp: "50 HP+", type: "Haulage & Transport" },
  { id: 6, name: "Water Tanker", rate: 700, img: "📐", hp: "65 HP", type: "Land Leveling" }
];


export default function Home({ onLogout, loggedInUser }) {
  const [selectedMachine, setSelectedMachine] = useState(CULTIVATORS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const totalHours = seconds / 3600;
  const totalCost = totalHours * selectedMachine.rate;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleToggleTimer = async () => {
    if (isRunning) {
      let liveLocation = { latitude: null, longitude: null };

      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              liveLocation.latitude = position.coords.latitude;
              liveLocation.longitude = position.coords.longitude;
              resolve();
            },
            () => { resolve(); },
            { enableHighAccuracy: true, timeout: 5000 }
          );
        });
      }

      try {
        const response = await fetch('http://localhost:5001/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cultivatorName: selectedMachine.name,
            ratePerHour: selectedMachine.rate,
            totalHours: parseFloat(totalHours.toFixed(4)),
            totalCost: parseFloat(totalCost.toFixed(2)),
            email: loggedInUser?.email,               
            mobileNumber: loggedInUser?.mobileNumber,
            location: liveLocation
          })
        });
        
        const data = await response.json();
        if (data.success) {
          alert(`🎉 Metrics & GPS data dispatched to:\n📧 ${loggedInUser?.email}\n📱 ${loggedInUser?.mobileNumber}`);
          setSeconds(0);
        }
      } catch (err) {
        alert("Saved to fallback local log profile simulation!");
        setSeconds(0);
      }
    }
    setIsRunning(!isRunning);
  };

  const formatTime = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="portal-container">
      <header className="portal-header">
        <div className="header-logo">🚜 Tractors<span>Timer</span></div>
        <div className="header-search">
          <input type="text" placeholder="Search cultivators, machinery or implement models..." disabled />
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </header>

      <main className="portal-main">
        <section className="billing-panel">
          <div className="sticky-tracker">
            <h3>⚡ Live Session Tracker</h3>
            <p className="active-tag">Active User: <strong>{loggedInUser?.mobileNumber}</strong></p>
            
            <div className="mega-timer">{formatTime(seconds)}</div>

            <div className="price-matrix">
              <div className="matrix-row"><span>Hourly Rate:</span> <strong>₹{selectedMachine.rate}/hr</strong></div>
              <div className="matrix-row"><span>Total Hours:</span> <strong>{totalHours.toFixed(4)} hrs</strong></div>
              <div className="matrix-row total"><span>Live Bill:</span> <strong>₹{totalCost.toFixed(2)}</strong></div>
            </div>

            <button className={`action-btn ${isRunning ? 'running' : ''}`} onClick={handleToggleTimer}>
              {isRunning ? "⏹️ Stop & Save Work" : "▶️ Start Timer"}
            </button>
          </div>
        </section>

        <section className="catalog-panel">
          <h2>Popular Cultivators & Implements</h2>
          <div className="tab-bar">
            <span className="active-tab">All Machinery</span>
            <span>Tillage</span>
            <span>Harrowing</span>
          </div>

          <div className="equipment-grid">
            {CULTIVATORS.map((machine) => (
              <div key={machine.id} className={`equipment-card ${selectedMachine.id === machine.id ? 'active-card' : ''}`}>
                <div className="card-image-box">
                  {machine.img.startsWith('/') ? (
                    <img src={machine.img} alt={machine.name} style={{ height: '85%', width: '85%', objectFit: 'contain' }} />
                  ) : (
                    machine.img
                  )}
                </div>
                <div className="card-body">
                  <div className="card-details-left">
                    <span className="badge">{machine.type}</span>
                    <h3>{machine.name}</h3>
                    <p className="specs">Capacity specs: {machine.hp}</p>
                    <div className="card-price">From <span>₹{machine.rate}</span> / hour</div>
                  </div>
                  <button className="select-machine-btn" disabled={isRunning} onClick={() => setSelectedMachine(machine)}>
                    {selectedMachine.id === machine.id ? "Connected ✅" : "Connect Implement"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}