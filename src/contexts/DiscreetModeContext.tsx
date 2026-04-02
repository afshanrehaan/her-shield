import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface DiscreetModeContextType {
  isDiscreet: boolean;
  toggleDiscreet: () => void;
}

const DiscreetModeContext = createContext<DiscreetModeContextType>({
  isDiscreet: false,
  toggleDiscreet: () => {},
});

export const useDiscreetMode = () => useContext(DiscreetModeContext);

export const DiscreetModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDiscreet, setIsDiscreet] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setIsDiscreet((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("discreet-mode", isDiscreet);
  }, [isDiscreet]);

  return (
    <DiscreetModeContext.Provider value={{ isDiscreet, toggleDiscreet: () => setIsDiscreet((p) => !p) }}>
      {children}
    </DiscreetModeContext.Provider>
  );
};
