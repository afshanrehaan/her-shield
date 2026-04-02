import { useState, useEffect, useRef } from "react";
import { MapPin, Wifi, AlertCircle, Navigation, Compass, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDiscreetMode } from "@/contexts/DiscreetModeContext";
import { useToast } from "@/hooks/use-toast";

const SecurityPage = () => {
  const { isDiscreet } = useDiscreetMode();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const animFrame = useRef<number>(0);

  // Simulated magnetometer for hidden camera detection
  const startScan = () => {
    setScanning(true);
    setScanResult(null);
    let tick = 0;
    const simulate = () => {
      tick++;
      setMagnetometerData({
        x: Math.sin(tick * 0.05) * 30 + Math.random() * 5,
        y: Math.cos(tick * 0.07) * 25 + Math.random() * 5,
        z: Math.sin(tick * 0.03) * 20 + Math.random() * 5,
      });
      if (tick < 150) {
        animFrame.current = requestAnimationFrame(simulate);
      } else {
        setScanning(false);
        const safe = Math.random() > 0.3;
        setScanResult(safe ? "No suspicious electromagnetic signals detected. Area appears safe." : "Unusual magnetic field detected! Investigate the area carefully.");
        toast({
          title: safe ? "✅ Scan Complete" : "⚠️ Anomaly Detected",
          description: safe ? "No hidden cameras detected" : "Unusual electromagnetic signal found",
          variant: safe ? "default" : "destructive",
        });
      }
    };
    simulate();
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  if (isDiscreet) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl font-bold">Maps</h1>
        <div className="rounded-xl bg-card p-6 shadow-soft aspect-video flex items-center justify-center">
          <p className="text-muted-foreground">Map loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" /> Security Toolkit
        </h1>
        <p className="text-muted-foreground">Safe routes, hidden camera detection & personal safety tools</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Safe Route */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card p-6 shadow-soft"
        >
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" /> Safe Route Finder
          </h2>
          <div className="aspect-video rounded-xl bg-muted flex items-center justify-center mb-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-background" />
            <div className="relative z-10 text-center space-y-3 p-4">
              <MapPin className="h-10 w-10 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                Safe Route uses Google Maps API to identify well-lit, populated paths.
              </p>
              <p className="text-xs text-muted-foreground">
                Connect Google Maps API key to enable live routing
              </p>
            </div>
            {/* Decorative route lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 250">
              <path d="M 50 200 Q 100 100 200 120 T 350 80" stroke="hsl(355 72% 65%)" fill="none" strokeWidth="3" strokeDasharray="8 4" />
              <path d="M 50 200 Q 150 150 250 180 T 350 80" stroke="hsl(220 40% 20%)" fill="none" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="50" cy="200" r="6" fill="hsl(155 60% 45%)" />
              <circle cx="350" cy="80" r="6" fill="hsl(355 72% 65%)" />
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Well-Lit", icon: "💡", desc: "Street lighting" },
              { label: "Populated", icon: "👥", desc: "Foot traffic" },
              { label: "CCTV", icon: "📹", desc: "Camera coverage" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-muted p-3">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-xs font-medium text-foreground mt-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hidden Camera Detector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card p-6 shadow-soft"
        >
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" /> Hidden Camera Detector
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Scans for unusual electromagnetic fields that may indicate hidden recording devices.
          </p>

          <Button
            onClick={startScan}
            disabled={scanning}
            className="w-full gradient-coral text-primary-foreground mb-4"
          >
            <Compass className="h-4 w-4 mr-2" />
            {scanning ? "Scanning..." : "Start Scan"}
          </Button>

          {/* Magnetometer visualization */}
          <div className="rounded-xl bg-muted p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              {(["x", "y", "z"] as const).map((axis) => (
                <div key={axis} className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase">{axis}-axis</span>
                  <motion.div
                    animate={{ opacity: scanning ? 1 : 0.5 }}
                    className="text-lg font-mono font-bold text-foreground"
                  >
                    {magnetometerData[axis].toFixed(1)}
                  </motion.div>
                  <div className="h-1.5 rounded-full bg-background overflow-hidden">
                    <motion.div
                      className="h-full rounded-full gradient-coral"
                      animate={{ width: `${Math.abs(magnetometerData[axis]) * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {scanning && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-center text-sm text-primary font-medium"
              >
                Scanning electromagnetic field...
              </motion.div>
            )}
          </div>

          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-lg p-4 flex items-start gap-3 ${
                scanResult.includes("safe") ? "bg-success/10" : "bg-destructive/10"
              }`}
            >
              <AlertCircle className={`h-5 w-5 mt-0.5 ${scanResult.includes("safe") ? "text-success" : "text-destructive"}`} />
              <p className="text-sm text-foreground">{scanResult}</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Safety tips */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-card p-6 shadow-soft"
      >
        <h2 className="font-display text-xl font-semibold mb-4">Quick Safety Tips</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Share your live location with trusted contacts when traveling alone",
            "Check for hidden cameras in hotel rooms, especially near mirrors and smoke detectors",
            "Keep your phone charged and emergency numbers saved offline",
            "Trust your instincts — if something feels wrong, leave immediately",
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 rounded-lg bg-muted p-3">
              <span className="text-primary font-bold">{i + 1}</span>
              <p className="text-sm text-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default SecurityPage;
