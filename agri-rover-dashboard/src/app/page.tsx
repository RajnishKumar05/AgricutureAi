"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Showcase from "@/components/showcase";
import {
  CropCalendar,
  IrrigationSuggestion,
  SoilHealthEstimator,
} from "@/components/smartwidget";

type SensorData = {
  temperature?: number;
  humidity?: number;
  airQuality?: number;
  moisture?: number;
  distance?: number;
  rainPrediction?: string;
};

export default function Home() {
  const router = useRouter();
  const [sensorData, setSensorData] = useState<SensorData>({});

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.50.79/ws");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const rain = getRainPrediction(data.temperature, data.humidity);
        setSensorData({ ...data, rainPrediction: rain });
      } catch (err) {
        console.error("Sensor error:", err);
      }
    };
    return () => ws.close();
  }, []);

  const getRainPrediction = (temperature: number, humidity: number) => {
    if (humidity > 80 && temperature < 20) return "🌧 Rain likely";
    if (humidity > 60 && temperature < 30) return "☁️ Chance of rain";
    return "☀️ No rain expected";
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-green-100 to-green-300 text-green-900 p-6">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-green-800 drop-shadow-md">
          🌿 Welcome to Agri Rover
        </h1>

        {/* Sensor Summary */}
        <div className="text-sm text-green-800 flex flex-wrap justify-center gap-6 mt-2">
          <span>🌡 {sensorData.temperature}°C</span>
          <span>💦 {sensorData.humidity}%</span>
          <span>🌬 AQ: {sensorData.airQuality}</span>
          <span>💧 Moisture: {sensorData.moisture}%</span>
          <span>📏 {sensorData.distance} cm</span>
          <span>{sensorData.rainPrediction}</span>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-10 w-full px-4 relative z-0">
        {/* Showcase: 70% width */}
        <div className="md:col-span-7 max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-md p-4 relative z-0">
          <Showcase />
        </div>

        {/* Smart Widgets: 30% width */}
        <div className="md:col-span-3 flex flex-col space-y-6 relative z-10">
          <IrrigationSuggestion
            moisture={sensorData.moisture}
            temperature={sensorData.temperature}
          />
          <SoilHealthEstimator
            pH={6.5}
            moisture={sensorData.moisture}
            organic={3.2}
          />
          <CropCalendar />

          {/* Buttons */}
          <div className="flex flex-col space-y-4 pt-4 relative z-10">
            <Button
              variant="outline"
              onClick={() => {
                console.log("Navigating to AI Assistant");
                router.push("/ai-agent");
              }}
              className="transition-transform duration-200 hover:scale-105"
            >
              🤖 AI Assistant
            </Button>

            <Button
              onClick={() => {
                console.log("Navigating to Sensor Dashboard");
                router.push("/sensor-dashboard");
              }}
              className="bg-green-600 text-white hover:bg-green-700 transition-transform duration-200 hover:scale-105"
            >
              📊 Dashboard
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
