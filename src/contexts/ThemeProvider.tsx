"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeName, DEFAULT_THEME } from "@/lib/theme-utils";

interface ThemeContextType {
  theme: ThemeName;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: ThemeName;
}

export function ThemeProvider({
  children,
  theme = DEFAULT_THEME, // if theme is not provided, use the default theme
}: ThemeProviderProps) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Keep backward compatibility
export const useThemeContext = useTheme;
