
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyTracker from "@/components/DailyTracker";
import TrendsView from "@/components/TrendsView";
import MedicationLog from "@/components/MedicationLog";
import { Activity, TrendingUp, Pill } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <header className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pain Tracker</h1>
          <p className="text-gray-600 text-lg">
            Your personal health companion for managing chronic pain
          </p>
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
