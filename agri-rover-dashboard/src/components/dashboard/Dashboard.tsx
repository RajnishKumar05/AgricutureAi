'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const graphColors: Record<string, string> = {
  airQuality: '#84cc16',
  distance: '#38bdf8',
  moisture: '#facc15',
  temperature: '#f87171',
  humidity: '#34d399'
};

const Dashboard = () => {
  const [sensorData, setSensorData] = useState<any>({});
  const [history, setHistory] = useState<any[]>([]);
  const [visibleGraph, setVisibleGraph] = useState<string>('temperature');
  const [graphType, setGraphType] = useState<string>('line');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const getRainPrediction = (temperature: number, humidity: number) => {
    if (humidity > 80 && temperature < 20) return 'Rain is likely!';
    if (humidity > 60 && temperature < 30) return 'Chance of rain.';
    return 'No rain expected.';
  };

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.50.79/ws');
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const time = new Date().toLocaleTimeString();
        data.rainPrediction = getRainPrediction(data.temperature, data.humidity);
        data.time = time;

        setSensorData(data);
        setHistory(prev => {
          const updated = [...prev, data];
          return updated.length > 50 ? updated.slice(-50) : updated;
        });
      } catch (err) {
        console.error('WebSocket error:', err);
      }
    };
    return () => socket.close();
  }, []);

  const renderChart = (sensor: string) => {
    const color = graphColors[sensor];
    switch (graphType) {
      case 'bar':
        return (
          <BarChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={sensor} fill={color} />
          </BarChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Scatter data={history} fill={color} dataKey={sensor} />
          </ScatterChart>
        );
      default:
        return (
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={sensor} stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-green-800 text-lime-300 flex">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} bg-black/30 h-screen p-4`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Menu</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        {sidebarOpen && (
          <>
            <div className="space-y-3">
              {['temperature', 'humidity', 'airQuality', 'moisture', 'distance'].map((sensor) => (
                <button
                  key={sensor}
                  onClick={() => setVisibleGraph(sensor)}
                  className="w-full text-left bg-lime-600 hover:bg-lime-700 px-4 py-2 rounded-md"
                >
                  {sensor.charAt(0).toUpperCase() + sensor.slice(1)}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <p className="font-semibold mb-2">Graph Type:</p>
              {['line', 'bar', 'scatter'].map(type => (
                <button
                  key={type}
                  onClick={() => setGraphType(type)}
                  className="block w-full mb-2 bg-lime-600 hover:bg-lime-700 px-4 py-2 rounded-md"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">🌾 Modern Agri-Tech Dashboard</h1>
          <Image src="/images/agrirover-logo.png" alt="Logo" width={50} height={50} className="rounded-full shadow-lg" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['temperature', 'humidity', 'airQuality', 'moisture', 'distance'].map((key) => (
            <div key={key} className="bg-black/20 p-4 rounded-xl shadow hover:scale-105 transition cursor-default">
              <h2 className="text-xl font-semibold capitalize">{key}</h2>
              <p className="text-2xl">{sensorData[key]}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-black/30 p-4 rounded-xl text-center">
          🌧️ Rain Prediction: <strong>{sensorData.rainPrediction}</strong>
        </div>

        <div className="mt-10 bg-black/20 p-6 rounded-2xl">
          <h2 className="text-2xl mb-4 capitalize">{visibleGraph} Chart</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(visibleGraph)}
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;