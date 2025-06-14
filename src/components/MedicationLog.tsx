import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pill, Clock, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fetchMedications = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from('medications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const addMedication = async (med: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in");
  const { error } = await supabase.from('medications').insert({ ...med, user_id: user.id });
  if (error) throw new Error(error.message);
};

const deleteMedication = async (id: string) => {
  const { error } = await supabase.from('medications').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

const MedicationLog = () => {
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    notes: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: fetchMedications,
  });

  const addMutation = useMutation({
    mutationFn: addMedication,
    onSuccess: () => {
      toast({ title: "Medication added", description: `${newMed.name} has been added.` });
      setNewMed({ name: "", dosage: "", frequency: "", time: "", notes: "" });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" })
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => {
      toast({ title: "Medication removed." });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" })
  });

  const handleAddMedication = () => {
    if (!newMed.name || !newMed.dosage || !newMed.frequency) {
      toast({ title: "Missing information", description: "Please fill in medication name, dosage, and frequency.", variant: "destructive" });
      return;
    }
    addMutation.mutate(newMed);
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
              <Input id="medName" placeholder="e.g., Ibuprofen" value={newMed.name} onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" placeholder="e.g., 200mg" value={newMed.dosage} onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={newMed.frequency} onValueChange={(value) => setNewMed(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                <SelectContent>{frequencyOptions.map((freq) => (<SelectItem key={freq} value={freq}>{freq}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="time">Preferred Time</Label>
              <Input id="time" type="time" value={newMed.time} onChange={(e) => setNewMed(prev => ({ ...prev, time: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input id="notes" placeholder="e.g., Take with food" value={newMed.notes} onChange={(e) => setNewMed(prev => ({ ...prev, notes: e.target.value }))} />
          </div>
          <Button onClick={handleAddMedication} disabled={addMutation.isPending} className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            <Plus className="w-4 h-4 mr-2" />
            {addMutation.isPending ? "Adding..." : "Add Medication"}
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
          {isLoading ? <Skeleton className="h-24 w-full" /> : medications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No medications added</h3>
              <p className="text-gray-500">Add your first medication to start tracking.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med: any) => (
                <div key={med.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{med.name}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{med.dosage}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{med.frequency}</div>
                        {med.time && (<div className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(`1970-01-01T${med.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>)}
                      </div>
                      {med.notes && (<p className="text-sm text-gray-600 mt-2 italic">{med.notes}</p>)}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(med.id)} disabled={deleteMutation.isPending && deleteMutation.variables === med.id} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
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
