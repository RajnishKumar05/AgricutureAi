"use client";
import { useState } from 'react';

export function CropCalendar() {
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const schedule = {
    wheat: { sow: "Nov", harvest: "Apr" },
    rice: { sow: "Jun", harvest: "Oct" },
    corn: { sow: "May", harvest: "Sep" }
  };

  const { sow, harvest } = schedule[selectedCrop];

  return (
    <div className="bg-white/80 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">📅 Crop Calendar</h3>
      <select
        value={selectedCrop}
        onChange={(e) => setSelectedCrop(e.target.value)}
        className="p-2 border rounded w-full"
      >
        {Object.keys(schedule).map((crop) => (
          <option key={crop} value={crop}>{crop.toUpperCase()}</option>
        ))}
      </select>
      <p className="mt-2">🌱 Sow: <strong>{sow}</strong></p>
      <p>🌾 Harvest: <strong>{harvest}</strong></p>
    </div>
  );
}

export function IrrigationSuggestion({ moisture = 50, temperature = 25 }: { moisture?: number, temperature?: number }) {
  let message = "✅ Soil moisture is fine.";
  if (moisture < 30) message = "💧 Soil is dry – Irrigate now!";
  else if (moisture < 50) message = "🟡 Light irrigation recommended.";
  else if (moisture > 80) message = "⚠️ Too wet – Hold off on irrigation.";
  if (temperature > 35 && moisture < 50) message += " 🥵 High temperature, consider more watering.";

  return (
    <div className="bg-white/80 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">💦 Irrigation Suggestion</h3>
      <p>{message}</p>
    </div>
  );
}

export function SoilHealthEstimator({ pH = 6.5, moisture = 50, organic = 3.2 }: { pH?: number, moisture?: number, organic?: number }) {
  let status = "🟢 Healthy";
  if (pH < 5.5 || pH > 7.5) status = "🔴 pH out of range";
  else if (moisture < 30) status = "🟠 Low moisture";
  else if (organic < 2.5) status = "🟡 Low organic content";

  return (
    <div className="bg-white/80 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">🧪 Soil Health</h3>
      <ul className="space-y-1 text-sm">
        <li>pH Level: {pH}</li>
        <li>Moisture: {moisture}%</li>
        <li>Organic Matter: {organic}%</li>
        <li>Status: <strong>{status}</strong></li>
      </ul>
    </div>
  );
}
