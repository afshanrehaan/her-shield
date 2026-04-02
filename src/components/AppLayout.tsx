import { Link, useLocation } from "react-router-dom";
import { Shield, Heart, MapPin, AlertTriangle, Home } from "lucide-react";
import { useDiscreetMode } from "@/contexts/DiscreetModeContext";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/sos", icon: AlertTriangle, label: "SOS" },
  { path: "/health", icon: Heart, label: "Health" },
  { path: "/security", icon: MapPin, label: "Security" },
];

const discreetNavItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/sos", icon: Home, label: "News" },
  { path: "/health", icon: Home, label: "Weather" },
  { path: "/security", icon: Home, label: "Maps" },
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isDiscreet } = useDiscreetMode();
  const items = isDiscreet ? discreetNavItems : navItems;

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            {!isDiscreet && <Shield className="h-6 w-6 text-primary" />}
            <span className="font-display text-xl font-bold text-foreground">
              {isDiscreet ? "Daily Digest" : "Her Shield"}
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          {!isDiscreet && (
            <span className="hidden lg:block text-xs text-muted-foreground">
              Ctrl+Shift+D: Discreet Mode
            </span>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/90 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-around py-2">
          {items.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
