"use client";

import { useEffect } from "react";

import {
  getSettings,
  type ThemePreference,
} from "@/lib/settings";

const THEME_EVENT = "orthform-theme-change";

export default function ThemeController() {
  useEffect(() => {
    const applyTheme = (
      theme: ThemePreference
    ) => {
      document.documentElement.dataset.theme =
        theme;
    };

    // Apply the persisted theme on initial load.
    applyTheme(getSettings().theme);

    // React immediately when Settings changes the theme.
    const handleThemeChange = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<ThemePreference>;

      if (
        customEvent.detail === "light" ||
        customEvent.detail === "dark"
      ) {
        applyTheme(customEvent.detail);
      }
    };

    window.addEventListener(
      THEME_EVENT,
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        THEME_EVENT,
        handleThemeChange
      );
    };
  }, []);

  return null;
}