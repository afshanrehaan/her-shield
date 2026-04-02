import { Link } from "react-router-dom";
import { Shield, Heart, MapPin, AlertTriangle, Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useDiscreetMode } from "@/contexts/DiscreetModeContext";

const features = [
  {
    icon: AlertTriangle,
    title: "Emergency SOS",
    desc: "One-tap panic button with live GPS & siren alert",
    path: "/sos",
    gradient: "gradient-coral",
  },
  {
    icon: Heart,
    title: "Health Dashboard",
    desc: "Track cycles, wellness logs & health trends",
    path: "/health",
    gradient: "gradient-navy",
  },
  {
    icon: MapPin,
    title: "Security Toolkit",
    desc: "Safe routes, hidden camera detector & more",
    path: "/security",
    gradient: "gradient-coral",
  },
];

const WeatherDiscreet = () => (
  <div className="space-y-6">
    <h1 className="font-display text-3xl font-bold">Today's Weather</h1>
    <div className="grid gap-4 md:grid-cols-3">
      {["Sunny, 24°C", "Partly Cloudy, 21°C", "Rain expected, 18°C"].map((w, i) => (
        <div key={i} className="rounded-xl bg-card p-6 shadow-soft">
          <p className="text-lg font-medium text-foreground">{w}</p>
          <p className="text-sm text-muted-foreground">Updated just now</p>
        </div>
      ))}
    </div>
    <div className="rounded-xl bg-card p-6 shadow-soft">
      <h2 className="font-display text-xl font-semibold mb-4">Weekly Forecast</h2>
      {["Mon: 22°C", "Tue: 20°C", "Wed: 25°C", "Thu: 19°C", "Fri: 23°C"].map((d, i) => (
        <p key={i} className="py-1 text-muted-foreground">{d}</p>
      ))}
    </div>
  </div>
);

const Index = () => {
  const { isDiscreet } = useDiscreetMode();

  if (isDiscreet) return <WeatherDiscreet />;

  return (
    <div className="space-y-12 pb-20 md:pb-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 pt-8"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gradient-coral shadow-coral">
          <Shield className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          Your Safety, <span className="text-gradient-coral">Your Power</span>
        </h1>
        <p className="mx-auto max-w-lg text-lg text-muted-foreground">
          Health tracking, emergency response & personal security — all in one private, empowering platform.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>End-to-end privacy · Press Ctrl+Shift+D for Discreet Mode</span>
        </div>
      </motion.section>

      {/* Feature cards */}
      <section className="grid gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.path}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
          >
            <Link
              to={f.path}
              className="group block rounded-2xl bg-card p-6 shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.gradient}`}>
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
              <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Explore <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Quick SOS */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <Link
          to="/sos"
          className="inline-flex items-center gap-3 rounded-full gradient-coral px-8 py-4 text-lg font-semibold text-primary-foreground shadow-coral hover:scale-105 transition-transform"
        >
          <AlertTriangle className="h-6 w-6" />
          Emergency SOS
        </Link>
      </motion.section>
    </div>
  );
};

export default Index;
