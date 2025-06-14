
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

const TrendsView = () => {
  const [entries, setEntries] = useState([]);
  const [avgPainLevel, setAvgPainLevel] = useState(0);
  const [painTrend, setPainTrend] = useState("stable");

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('painEntries') || '[]');
    const sortedEntries = storedEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEntries(sortedEntries);

    if (sortedEntries.length > 0) {
      const total = sortedEntries.reduce((sum, entry) => sum + entry.painLevel, 0);
      setAvgPainLevel((total / sortedEntries.length).toFixed(1));

      // Calculate trend
      if (sortedEntries.length >= 3) {
        const recent = sortedEntries.slice(-3);
        const older = sortedEntries.slice(-6, -3);
        
        if (older.length > 0) {
          const recentAvg = recent.reduce((sum, e) => sum + e.painLevel, 0) / recent.length;
          const olderAvg = older.reduce((sum, e) => sum + e.painLevel, 0) / older.length;
          
          const diff = recentAvg - olderAvg;
          if (diff > 0.5) setPainTrend("increasing");
          else if (diff < -0.5) setPainTrend("decreasing");
          else setPainTrend("stable");
        }
      }
    }
  }, []);

  const chartData = entries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    painLevel: entry.painLevel,
    fullDate: entry.date
  }));

  // Count symptoms frequency
  const symptomCounts = {};
  entries.forEach(entry => {
    if (entry.symptoms) {
      entry.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    }
  });

  const symptomData = Object.entries(symptomCounts)
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const getTrendIcon = () => {
    if (painTrend === "increasing") return <TrendingUp className="w-5 h-5 text-red-500" />;
    if (painTrend === "decreasing") return <TrendingDown className="w-5 h-5 text-green-500" />;
    return <Calendar className="w-5 h-5 text-blue-500" />;
  };

  const getTrendColor = () => {
    if (painTrend === "increasing") return "text-red-600 bg-red-50 border-red-200";
    if (painTrend === "decreasing") return "text-green-600 bg-green-50 border-green-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Pain Level</p>
                <p className="text-3xl font-bold text-gray-800">{avgPainLevel}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-3xl font-bold text-gray-800">{entries.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pain Trend</p>
                <p className={`text-lg font-semibold capitalize ${getTrendColor().split(' ')[0]}`}>
                  {painTrend}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTrendColor().split(' ').slice(1).join(' ')}`}>
                {getTrendIcon()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {entries.length > 0 ? (
        <>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Pain Level Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis domain={[0, 10]} stroke="#6b7280" />
                    <Tooltip 
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="painLevel" 
                      stroke="url(#gradient)" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: '#1d4ed8' }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {symptomData.length > 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Most Common Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={symptomData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis 
                        dataKey="symptom" 
                        stroke="#6b7280" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: 'none', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No data yet</h3>
            <p className="text-gray-500">Start tracking your pain levels to see trends and insights here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrendsView;
