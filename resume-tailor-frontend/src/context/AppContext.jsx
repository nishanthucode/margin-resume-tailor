import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeParsed, setResumeParsed] = useState(null);
  const [jdParsed, setJdParsed] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [tailoredBullets, setTailoredBullets] = useState(null);

  const reset = () => {
    setResumeText("");
    setJdText("");
    setResumeParsed(null);
    setJdParsed(null);
    setAnalysis(null);
    setTailoredBullets(null);
  };

  return (
    <AppContext.Provider
      value={{
        resumeText, setResumeText,
        jdText, setJdText,
        resumeParsed, setResumeParsed,
        jdParsed, setJdParsed,
        analysis, setAnalysis,
        tailoredBullets, setTailoredBullets,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
