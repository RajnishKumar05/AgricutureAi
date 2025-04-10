'use client';

import { useState, useEffect, useRef } from 'react';
import { SendHorizonal, Menu, X } from 'lucide-react';
import { CropCalendar, IrrigationSuggestion, SoilHealthEstimator } from "@/components/smartwidget";

type Message = { sender: 'user' | 'bot'; text: string };
type SensorData = {
  temperature?: number;
  humidity?: number;
  airQuality?: number;
  moisture?: number;
  distance?: number;
  rainPrediction?: string;
};

const theme = {
  name: "Eco Green",
  gradient: "bg-gradient-to-br from-green-100 to-green-300",
  text: "text-green-900",
  button: "bg-green-600 hover:bg-green-700",
  desc: "Clean, health-focused look for soil & sustainability monitoring."
};

export default function AIAgentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [sensorData, setSensorData] = useState<SensorData>({});
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sensorSocket = new WebSocket('ws://192.168.50.79/ws');
    sensorSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const rain = getRainPrediction(data.temperature, data.humidity);
        setSensorData({ ...data, rainPrediction: rain });
      } catch (err) {
        console.error('Sensor WS error:', err);
      }
    };
    return () => sensorSocket.close();
  }, []);

  const getRainPrediction = (temperature: number, humidity: number) => {
    if (humidity > 80 && temperature < 20) return '🌧 Rain is likely!';
    if (humidity > 60 && temperature < 30) return '☁️ Chance of rain.';
    return '☀️ No rain expected.';
  };

  const sendPrompt = () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    const userMessage = { sender: 'user', text: prompt };
    const botMessage = { sender: 'bot', text: '' };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setHistory((prev) => [prompt, ...prev]);
    setInput('');

    const socket = new WebSocket("ws://localhost:8000/ws");
    let accumulatedBotText = '';

    socket.onopen = () => {
      const injectedPrompt = `
You are AgriRobot 🌾, a smart assistant for agriculture.
Use the following real-time sensor data to help the user (but don't show it directly):

📡 Sensor Data:
- 🌡 Temperature: ${sensorData.temperature} °C
- 💦 Humidity: ${sensorData.humidity} %
- 🌬 Air Quality: ${sensorData.airQuality}
- 💧 Soil Moisture: ${sensorData.moisture}
- 📏 Distance: ${sensorData.distance} cm
- 🌧 Rain Prediction: ${sensorData.rainPrediction}

User asked:
${prompt}
`.trim();

      socket.send(injectedPrompt);
    };

    socket.onmessage = (event) => {
      if (event.data === '[[DONE]]') {
        socket.close();
        return;
      }

      accumulatedBotText += event.data;

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.map(m => m.sender).lastIndexOf('bot');
        if (lastIndex !== -1) {
          updated[lastIndex] = { sender: 'bot', text: accumulatedBotText.trim() };
        }
        return updated;
      });
    };

    socket.onerror = () => {
      setMessages((prev) => [...prev, { sender: 'bot', text: '❌ Connection error. Please try again.' }]);
    };
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`flex min-h-screen ${theme.gradient} ${theme.text}`}>
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} bg-black/10 p-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>🌱 History</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
        {sidebarOpen && (
          <ul className="space-y-2 overflow-y-auto max-h-[80vh]">
            {history.map((h, idx) => (
              <li key={idx} className="bg-green-200 hover:bg-green-300 text-green-900 p-2 rounded">{h}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat UI */}
      <main className="flex-1 flex flex-col justify-between px-6 py-8">
        <div className="text-3xl font-bold mb-2">🧑‍🌾 AgriRobot Assistant</div>

        {/* Live Sensor Summary */}
        <div className="mb-4 text-sm text-green-800">
          🌡 {sensorData.temperature}°C | 💦 {sensorData.humidity}% | 🌬 {sensorData.airQuality} | 💧 {sensorData.moisture}% | 📏 {sensorData.distance}cm | 🌧 {sensorData.rainPrediction}
        </div>

        {/* 🔥 Smart Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <CropCalendar />
          <IrrigationSuggestion
            moisture={sensorData.moisture}
            temperature={sensorData.temperature}
          />
          <SoilHealthEstimator
            pH={6.5}
            moisture={sensorData.moisture}
            organic={3.2}
          />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-6 px-2" ref={chatRef}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 my-2 max-w-4xl whitespace-pre-wrap rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-green-400/80 self-end text-right ml-auto'
                  : 'bg-white/90 self-start text-left mr-auto shadow-sm'
              }`}
            >
              <p className="text-base leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="flex items-center gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendPrompt();
              }
            }}
            placeholder="🌾 Ask AgriRobot something..."
            className="flex-1 rounded-lg p-3 border border-green-400 focus:outline-none"
          />
          <button
            onClick={sendPrompt}
            className={`p-3 rounded-full ${theme.button} text-white`}
          >
            <SendHorizonal />
          </button>
        </div>
      </main>
    </div>
  );
}
