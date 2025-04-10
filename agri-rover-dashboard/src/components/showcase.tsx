import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Showcase() {
  const [aiResponse, setAiResponse] = useState("Loading smart analysis...");

  useEffect(() => {
    const responses = [
      "Soil moisture is optimal for tomato crops 🌱",
      "Air quality is clean. No alerts. ✅",
      "AI suggests watering in 3 hours 💧",
      "Next pesticide spray recommended on Friday 🐞",
    ];

    let index = 0;
    const interval = setInterval(() => {
      setAiResponse(responses[index]);
      index = (index + 1) % responses.length;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold text-green-800 mb-[-10]"
      >
        
      </motion.div>

      {/* AI Response Section */}
      <motion.div
        className="w-full max-w-2xl mb-10"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 2 }}
      >
        <Card className="bg-white shadow-lg border-l-8 border-green-400 animate-pulse">
          <CardContent className="p-6 text-lg text-green-900">
            🤖 <span className="font-semibold">AI Insight:</span> {aiResponse}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dashboard Charts */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {["Soil Moisture", "Temperature", "Humidity", "Air Quality"].map((label, i) => {
          const graphData = Array.from({ length: 7 }).map((_, idx) => ({
            time: `Day ${idx + 1}`,
            value: parseFloat((Math.random() * 100).toFixed(2)),
          }));

          return (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-300 hover:scale-105 transition-transform duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h3 className="text-xl font-bold text-green-700 mb-2">{label}</h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          );
        })}
      </motion.div>
    </main>
  );
}
