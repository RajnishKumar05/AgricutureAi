"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const themes = [
  {
    name: "Eco Green",
    gradient: "from-green-100 to-green-300",
    text: "text-green-900",
    button: "bg-green-600 hover:bg-green-700",
    desc: "Clean, health-focused look for soil & sustainability monitoring."
  },
  {
    name: "Sunrise Fields",
    gradient: "from-orange-100 via-yellow-100 to-blue-100",
    text: "text-yellow-900",
    button: "bg-yellow-500 hover:bg-yellow-600",
    desc: "Warm sunrise vibes, perfect for crop and forecast data."
  },
  {
    name: "Modern Agri-Tech",
    gradient: "from-gray-900 to-green-800",
    text: "text-lime-300",
    button: "bg-lime-600 hover:bg-lime-700",
    desc: "Sleek and techy feel, made for smart farming dashboards."
  },
  {
    name: "Farm Fresh",
    gradient: "from-amber-100 via-lime-100 to-rose-50",
    text: "text-amber-800",
    button: "bg-amber-500 hover:bg-amber-600",
    desc: "Wholesome, vintage feel for marketplace or plant info."
  },
  {
    name: "Irrigation Focus",
    gradient: "from-blue-100 via-cyan-100 to-green-100",
    text: "text-blue-900",
    button: "bg-blue-500 hover:bg-blue-600",
    desc: "Water-based theme, great for moisture and irrigation data."
  }
];

export default function ThemePreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {themes.map((theme, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${theme.gradient} ${theme.text} rounded-2xl shadow-lg`}
        >
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">{theme.name}</h2>
            <p className="text-base">{theme.desc}</p>
            <Button className={`${theme.button}`}>Try this Theme</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
