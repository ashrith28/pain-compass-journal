
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PainLevelSelector from "./PainLevelSelector";
import SymptomTracker from "./SymptomTracker";
import { Calendar, Save } from "lucide-react";

const DailyTracker = () => {
  const [painLevel, setPainLevel] = useState(0);
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would save to a database
    const entry = {
      date: new Date().toISOString().split('T')[0],
      painLevel,
      symptoms,
      notes,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for now
    const existingEntries = JSON.parse(localStorage.getItem('painEntries') || '[]');
    const updatedEntries = [entry, ...existingEntries.filter(e => e.date !== entry.date)];
    localStorage.setItem('painEntries', JSON.stringify(updatedEntries));
    
    toast({
      title: "Entry saved!",
      description: "Your pain tracking data has been recorded.",
    });
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-2xl text-gray-800">{today}</CardTitle>
          </div>
          <p className="text-gray-600">How are you feeling today?</p>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Pain Level</CardTitle>
        </CardHeader>
        <CardContent>
          <PainLevelSelector value={painLevel} onChange={setPainLevel} />
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <SymptomTracker selectedSymptoms={symptoms} onChange={setSymptoms} />
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any additional notes about your pain, activities, or mood today..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave}
        size="lg"
        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
      >
        <Save className="w-5 h-5 mr-2" />
        Save Today's Entry
      </Button>
    </div>
  );
};

export default DailyTracker;
