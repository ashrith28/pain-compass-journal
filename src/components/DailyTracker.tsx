
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PainLevelSelector from "./PainLevelSelector";
import SymptomTracker from "./SymptomTracker";
import { Calendar, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTodaysEntry = async (date: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('pain_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore 'no rows found'
    throw new Error(error.message);
  }
  return data;
};

const upsertEntry = async (entry: { date: string, painLevel: number, symptoms: string[], notes: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in");

  const { painLevel, ...restOfEntry } = entry;

  const { error } = await supabase
    .from('pain_entries')
    .upsert({
      ...restOfEntry,
      pain_level: painLevel,
      user_id: user.id
    }, { onConflict: 'date,user_id' });

  if (error) throw new Error(error.message);
};

const DailyTracker = () => {
  const [painLevel, setPainLevel] = useState(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const todayISO = new Date().toISOString().split('T')[0];

  const { data: entry, isLoading } = useQuery({
    queryKey: ['todaysEntry', todayISO],
    queryFn: () => fetchTodaysEntry(todayISO),
  });

  useEffect(() => {
    if (entry) {
      setPainLevel(entry.pain_level || 0);
      setSymptoms(entry.symptoms || []);
      setNotes(entry.notes || "");
    }
  }, [entry]);

  const mutation = useMutation({
    mutationFn: upsertEntry,
    onSuccess: async () => {
      toast({
        title: "Entry saved!",
        description: "Your pain tracking data has been recorded.",
      });
      setPainLevel(0);
      setSymptoms([]);
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ['trends'] });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        try {
          const { error } = await supabase.functions.invoke('send-entry-confirmation', {
            body: { email: user.email },
          });
          if (error) throw error;
          console.log('Confirmation email sent.');
        } catch (error) {
          console.error('Failed to send confirmation email:', error);
          toast({
            title: "Notification Error",
            description: "Could not send the confirmation email.",
            variant: "destructive",
          });
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Error saving entry",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    mutation.mutate({
      date: todayISO,
      painLevel,
      symptoms,
      notes,
    });
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

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
        disabled={mutation.isPending}
        size="lg"
        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
      >
        <Save className="w-5 h-5 mr-2" />
        {mutation.isPending ? "Saving..." : "Save Today's Entry"}
      </Button>
    </div>
  );
};

export default DailyTracker;
