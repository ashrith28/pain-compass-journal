
import { useState } from "react";

interface PainLevelSelectorProps {
  value: number;
  onChange: (level: number) => void;
}

const PainLevelSelector = ({ value, onChange }: PainLevelSelectorProps) => {
  const [hoveredLevel, setHoveredLevel] = useState(0);

  const painDescriptions = [
    "No pain",
    "Very mild pain",
    "Mild pain", 
    "Moderate pain",
    "Moderately severe pain",
    "Severe pain",
    "Very severe pain",
    "Intense pain",
    "Extremely intense pain",
    "Unbearable pain",
    "Unimaginable pain"
  ];

  const getColorClass = (level: number) => {
    if (level === 0) return "bg-green-100 border-green-300 text-green-800";
    if (level <= 3) return "bg-yellow-100 border-yellow-300 text-yellow-800";
    if (level <= 6) return "bg-orange-100 border-orange-300 text-orange-800";
    return "bg-red-100 border-red-300 text-red-800";
  };

  const getHoverColorClass = (level: number) => {
    if (level === 0) return "hover:bg-green-200";
    if (level <= 3) return "hover:bg-yellow-200";
    if (level <= 6) return "hover:bg-orange-200";
    return "hover:bg-red-200";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-11 gap-2">
        {[...Array(11)].map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            onMouseEnter={() => setHoveredLevel(i)}
            onMouseLeave={() => setHoveredLevel(0)}
            className={`
              w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all duration-200 
              ${value === i ? getColorClass(i) + " ring-2 ring-blue-500 scale-110" : "bg-gray-50 border-gray-200 text-gray-600"}
              ${getHoverColorClass(i)}
              hover:scale-105 hover:shadow-md
            `}
          >
            {i}
          </button>
        ))}
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 mb-2">
          Pain Level: {value}/10
        </div>
        <div className={`text-lg font-medium px-4 py-2 rounded-full inline-block ${getColorClass(value)}`}>
          {painDescriptions[value]}
        </div>
      </div>
    </div>
  );
};

export default PainLevelSelector;
