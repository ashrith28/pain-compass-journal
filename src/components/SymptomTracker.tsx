
import { Button } from "@/components/ui/button";

interface SymptomTrackerProps {
  selectedSymptoms: string[];
  onChange: (symptoms: string[]) => void;
}

const SymptomTracker = ({ selectedSymptoms, onChange }: SymptomTrackerProps) => {
  const commonSymptoms = [
    "Headache",
    "Fatigue",
    "Stiffness",
    "Muscle aches",
    "Joint pain",
    "Back pain",
    "Neck pain",
    "Difficulty sleeping",
    "Mood changes",
    "Difficulty concentrating",
    "Nausea",
    "Dizziness"
  ];

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      onChange(selectedSymptoms.filter(s => s !== symptom));
    } else {
      onChange([...selectedSymptoms, symptom]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm">Select all symptoms you're experiencing today:</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {commonSymptoms.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom);
          return (
            <Button
              key={symptom}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSymptom(symptom)}
              className={`
                text-left justify-start h-auto py-3 px-4 transition-all duration-200
                ${isSelected 
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02]" 
                  : "hover:bg-gray-50 hover:border-gray-300 hover:scale-[1.02]"
                }
              `}
            >
              {symptom}
            </Button>
          );
        })}
      </div>

      {selectedSymptoms.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-2">
            Selected symptoms ({selectedSymptoms.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom) => (
              <span
                key={symptom}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomTracker;
