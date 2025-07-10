"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeName, DEFAULT_THEME } from "@/lib/theme-utils";
import { fetchThemeFromAPI } from "@/lib/theme-api";

interface ThemeContextType {
  theme: ThemeName;
  isLoading: boolean;
  // Keep backward compatibility with existing color system
  primaryColor: string;
  secondaryColor: string;
  updateTheme: (colors: {
    primaryColor: string;
    secondaryColor: string;
  }) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  selectedTheme?: ThemeName;
}

export function ThemeProvider({
  children,
  selectedTheme = DEFAULT_THEME,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(selectedTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Keep backward compatibility with existing color system
  const [primaryColor, setPrimaryColor] = useState("#234A66");
  const [secondaryColor, setSecondaryColor] = useState("#C9A95C");

  // Fetch theme from API on component mount
  useEffect(() => {
    const loadThemeFromAPI = async () => {
      try {
        setIsLoading(true);
        const apiTheme = await fetchThemeFromAPI();
        if (apiTheme !== theme) {
          setThemeState(apiTheme);
          document.documentElement.setAttribute("data-theme", apiTheme);
        }
      } catch (error) {
        console.warn("Failed to load theme from API, using default:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemeFromAPI();
  }, []);

  // Update data-theme attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const updateTheme = (colors: {
    primaryColor: string;
    secondaryColor: string;
  }) => {
    setPrimaryColor(colors.primaryColor);
    setSecondaryColor(colors.secondaryColor);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLoading,
        primaryColor,
        secondaryColor,
        updateTheme,
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
