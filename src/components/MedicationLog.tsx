
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pill, Clock, Trash2 } from "lucide-react";

const MedicationLog = () => {
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const storedMeds = JSON.parse(localStorage.getItem('medications') || '[]');
    setMedications(storedMeds);
  }, []);

  const addMedication = () => {
    if (!newMed.name || !newMed.dosage || !newMed.frequency) {
      toast({
        title: "Missing information",
        description: "Please fill in medication name, dosage, and frequency.",
        variant: "destructive"
      });
      return;
    }

    const medication = {
      id: Date.now(),
      ...newMed,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updatedMeds = [...medications, medication];
    setMedications(updatedMeds);
    localStorage.setItem('medications', JSON.stringify(updatedMeds));

    setNewMed({
      name: "",
      dosage: "",
      frequency: "",
      time: "",
      notes: ""
    });

    toast({
      title: "Medication added",
      description: `${medication.name} has been added to your log.`
    });
  };

  const deleteMedication = (id) => {
    const updatedMeds = medications.filter(med => med.id !== id);
    setMedications(updatedMeds);
    localStorage.setItem('medications', JSON.stringify(updatedMeds));
    
    toast({
      title: "Medication removed",
      description: "The medication has been removed from your log."
    });
  };

  const frequencyOptions = [
    "Once daily",
    "Twice daily", 
    "Three times daily",
    "Four times daily",
    "As needed",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "Weekly",
    "Other"
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Medication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="medName">Medication Name</Label>
              <Input
                id="medName"
                placeholder="e.g., Ibuprofen"
                value={newMed.name}
                onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                placeholder="e.g., 200mg"
                value={newMed.dosage}
                onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={newMed.frequency} onValueChange={(value) => setNewMed(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((freq) => (
                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={newMed.time}
                onChange={(e) => setNewMed(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="e.g., Take with food"
              value={newMed.notes}
              onChange={(e) => setNewMed(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <Button 
            onClick={addMedication}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Medication
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Your Medications ({medications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No medications added</h3>
              <p className="text-gray-500">Add your first medication to start tracking.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{med.name}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {med.dosage}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {med.frequency}
                        </div>
                        {med.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(`1970-01-01T${med.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                      
                      {med.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">{med.notes}</p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMedication(med.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationLog;
