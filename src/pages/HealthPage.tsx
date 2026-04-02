import { useState, useMemo } from "react";
import { Heart, Plus, Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDiscreetMode } from "@/contexts/DiscreetModeContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface HealthLog {
  date: string;
  type: "period" | "mood" | "symptom" | "exercise";
  value: string;
  intensity: number;
}

const HealthPage = () => {
  const { isDiscreet } = useDiscreetMode();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [logs, setLogs] = useState<HealthLog[]>(() => {
    const saved = localStorage.getItem("health-logs");
    return saved ? JSON.parse(saved) : generateSampleData();
  });
  const [logType, setLogType] = useState<HealthLog["type"]>("mood");
  const [logValue, setLogValue] = useState("");
  const [logIntensity, setLogIntensity] = useState(5);

  const addLog = () => {
    if (!selectedDate || !logValue.trim()) return;
    const newLog: HealthLog = {
      date: selectedDate.toISOString().split("T")[0],
      type: logType,
      value: logValue,
      intensity: logIntensity,
    };
    const updated = [...logs, newLog];
    setLogs(updated);
    localStorage.setItem("health-logs", JSON.stringify(updated));
    setLogValue("");
  };

  const loggedDates = useMemo(() => {
    const dates: Record<string, string[]> = {};
    logs.forEach((l) => {
      if (!dates[l.date]) dates[l.date] = [];
      dates[l.date].push(l.type);
    });
    return dates;
  }, [logs]);

  const chartData = useMemo(() => {
    const last14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 13 + i);
      const key = d.toISOString().split("T")[0];
      const dayLogs = logs.filter((l) => l.date === key);
      const avgIntensity = dayLogs.length > 0 ? dayLogs.reduce((a, b) => a + b.intensity, 0) / dayLogs.length : 0;
      return {
        date: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
        wellness: Math.round(avgIntensity * 10) / 10,
        entries: dayLogs.length,
      };
    });
    return last14;
  }, [logs]);

  const todayLogs = useMemo(() => {
    const today = selectedDate?.toISOString().split("T")[0] || "";
    return logs.filter((l) => l.date === today);
  }, [logs, selectedDate]);

  if (isDiscreet) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl font-bold">Weather Forecast</h1>
        <div className="rounded-xl bg-card p-6 shadow-soft">
          <p className="text-4xl font-bold text-foreground">24°C</p>
          <p className="text-muted-foreground">Sunny with light clouds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary" /> Health Dashboard
        </h1>
        <p className="text-muted-foreground">Track your cycles, mood & wellness trends</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-card p-6 shadow-soft"
        >
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" /> Cycle Calendar
          </h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              period: logs.filter((l) => l.type === "period").map((l) => new Date(l.date)),
              logged: Object.keys(loggedDates).map((d) => new Date(d)),
            }}
            modifiersStyles={{
              period: { backgroundColor: "hsl(355 72% 65% / 0.3)", borderRadius: "50%" },
              logged: { border: "2px solid hsl(355 72% 65%)", borderRadius: "50%" },
            }}
            className="rounded-lg"
          />

          {/* Day logs */}
          {todayLogs.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Entries for {selectedDate?.toLocaleDateString()}
              </p>
              {todayLogs.map((l, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={`h-2 w-2 rounded-full ${l.type === "period" ? "bg-primary" : l.type === "mood" ? "bg-accent" : "bg-success"}`} />
                  <span className="capitalize text-foreground">{l.type}:</span>
                  <span className="text-muted-foreground">{l.value}</span>
                  <span className="text-xs text-muted-foreground">({l.intensity}/10)</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add log form + charts */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-card p-6 shadow-soft space-y-4"
          >
            <h2 className="font-display text-lg font-semibold">Add Entry</h2>
            <Select value={logType} onValueChange={(v) => setLogType(v as HealthLog["type"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="period">Period</SelectItem>
                <SelectItem value="mood">Mood</SelectItem>
                <SelectItem value="symptom">Symptom</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Details (e.g., Heavy flow, Happy, Headache)" value={logValue} onChange={(e) => setLogValue(e.target.value)} />
            <div>
              <label className="text-sm text-muted-foreground">Intensity: {logIntensity}/10</label>
              <input
                type="range"
                min={1}
                max={10}
                value={logIntensity}
                onChange={(e) => setLogIntensity(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <Button onClick={addLog} className="w-full gradient-coral text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" /> Log Entry
            </Button>
          </motion.div>

          {/* Wellness chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card p-6 shadow-soft"
          >
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Wellness Trends (14 days)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}
                />
                <Line type="monotone" dataKey="wellness" stroke="hsl(355 72% 65%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-card p-6 shadow-soft"
          >
            <h2 className="font-display text-lg font-semibold mb-4">Daily Entries</h2>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}
                />
                <Bar dataKey="entries" fill="hsl(220 40% 20%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

function generateSampleData(): HealthLog[] {
  const data: HealthLog[] = [];
  const types: HealthLog["type"][] = ["period", "mood", "symptom", "exercise"];
  const values: Record<string, string[]> = {
    period: ["Light", "Medium", "Heavy"],
    mood: ["Happy", "Calm", "Anxious", "Tired"],
    symptom: ["Headache", "Cramps", "Bloating"],
    exercise: ["Walk", "Yoga", "Running"],
  };
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (Math.random() > 0.4) {
      const type = types[Math.floor(Math.random() * types.length)];
      const vals = values[type];
      data.push({
        date: d.toISOString().split("T")[0],
        type,
        value: vals[Math.floor(Math.random() * vals.length)],
        intensity: Math.floor(Math.random() * 8) + 2,
      });
    }
  }
  return data;
}

export default HealthPage;
