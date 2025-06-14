
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyTracker from "@/components/DailyTracker";
import TrendsView from "@/components/TrendsView";
import MedicationLog from "@/components/MedicationLog";
import { Activity, TrendingUp, Pill, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <header className="text-center mb-8 pt-6 relative">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pain Tracker</h1>
          <p className="text-gray-600 text-lg">
            Your personal health companion for managing chronic pain
          </p>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="absolute top-6 right-0 text-gray-600 hover:text-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </header>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <DailyTracker />
          </TabsContent>

          <TabsContent value="trends">
            <TrendsView />
          </TabsContent>

          <TabsContent value="medications">
            <MedicationLog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
