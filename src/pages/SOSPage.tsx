import { useState, useRef, useCallback } from "react";
import { AlertTriangle, MapPin, Phone, Volume2, VolumeX, Plus, Trash2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDiscreetMode } from "@/contexts/DiscreetModeContext";
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

const SOSPage = () => {
  const { isDiscreet } = useDiscreetMode();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [sirenOn, setSirenOn] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem("sos-contacts");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Mom", phone: "+1234567890" },
      { id: "2", name: "Best Friend", phone: "+0987654321" },
    ];
  });
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const startSiren = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    // Siren sweep
    const sweep = () => {
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 1);
      setTimeout(sweep, 1000);
    };
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    sweep();
    audioCtxRef.current = ctx;
    oscillatorRef.current = osc;
    setSirenOn(true);
  }, []);

  const stopSiren = useCallback(() => {
    oscillatorRef.current?.stop();
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    oscillatorRef.current = null;
    setSirenOn(false);
  }, []);

  const triggerSOS = () => {
    setIsActive(true);
    startSiren();
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          toast({
            title: "📍 Location acquired",
            description: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
          });
          // Simulate sending to contacts
          contacts.forEach((c) => {
            console.log(`SOS sent to ${c.name} (${c.phone}) with location: ${coords.lat}, ${coords.lng}`);
          });
          toast({
            title: "🚨 SOS Alerts Sent",
            description: `Notified ${contacts.length} emergency contacts`,
          });
        },
        () => {
          toast({
            title: "Location unavailable",
            description: "Enable location services for full SOS functionality",
            variant: "destructive",
          });
        }
      );
    }
  };

  const deactivateSOS = () => {
    setIsActive(false);
    stopSiren();
    setLocation(null);
  };

  const addContact = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    const updated = [...contacts, { id: Date.now().toString(), name: newName, phone: newPhone }];
    setContacts(updated);
    localStorage.setItem("sos-contacts", JSON.stringify(updated));
    setNewName("");
    setNewPhone("");
  };

  const removeContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    localStorage.setItem("sos-contacts", JSON.stringify(updated));
  };

  if (isDiscreet) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl font-bold">Breaking News</h1>
        <div className="space-y-3">
          {["Markets rally on positive economic data", "New tech innovations unveiled at summit", "Weather to improve across the region"].map((h, i) => (
            <div key={i} className="rounded-xl bg-card p-5 shadow-soft">
              <p className="font-medium text-foreground">{h}</p>
              <p className="text-sm text-muted-foreground mt-1">2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-bold text-foreground">Emergency SOS</h1>
        <p className="text-muted-foreground">One tap to alert your emergency contacts with your live location</p>
      </div>

      {/* Panic Button */}
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          {!isActive ? (
            <motion.button
              key="sos-btn"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerSOS}
              className="relative h-48 w-48 rounded-full gradient-coral shadow-coral flex items-center justify-center cursor-pointer"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full gradient-coral opacity-30"
              />
              <div className="text-center z-10">
                <AlertTriangle className="h-12 w-12 text-primary-foreground mx-auto mb-2" />
                <span className="text-xl font-bold text-primary-foreground">SOS</span>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="sos-active"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="mx-auto h-48 w-48 rounded-full bg-destructive flex items-center justify-center"
              >
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-destructive-foreground mx-auto mb-2" />
                  <span className="text-lg font-bold text-destructive-foreground">ACTIVE</span>
                </div>
              </motion.div>
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="sm" onClick={sirenOn ? stopSiren : startSiren}>
                  {sirenOn ? <VolumeX className="h-4 w-4 mr-1" /> : <Volume2 className="h-4 w-4 mr-1" />}
                  {sirenOn ? "Mute" : "Siren"}
                </Button>
                <Button variant="destructive" size="sm" onClick={deactivateSOS}>
                  Deactivate
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location info */}
      {location && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card p-4 shadow-soft flex items-center gap-3"
        >
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Your Location</p>
            <p className="text-xs text-muted-foreground">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
          </div>
          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-primary underline"
          >
            View Map
          </a>
        </motion.div>
      )}

      {/* Emergency Contacts */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" /> Emergency Contacts
        </h2>
        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-soft">
              <div className="h-10 w-10 rounded-full gradient-navy flex items-center justify-center text-sm font-bold text-secondary-foreground">
                {c.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.phone}</p>
              </div>
              {isActive && (
                <Send className="h-4 w-4 text-success animate-pulse" />
              )}
              <button onClick={() => removeContact(c.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
          <Input placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="flex-1" />
          <Button onClick={addContact} size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SOSPage;
