"use client";

import React, { createContext, useContext, useState } from "react";

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  updateTheme: (colors: {
    primaryColor: string;
    secondaryColor: string;
  }) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState("#234A66");
  const [secondaryColor, setSecondaryColor] = useState("#C9A95C");

  const updateTheme = (colors: {
    primaryColor: string;
    secondaryColor: string;
  }) => {
    setPrimaryColor(colors.primaryColor);
    setSecondaryColor(colors.secondaryColor);
  };

  return (
    <ThemeContext.Provider
      value={{ primaryColor, secondaryColor, updateTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
