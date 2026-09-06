// ==================================================
// ORTHFORM SETTINGS
// ==================================================

export type ThemePreference =
  | "light"
  | "dark";

const SETTINGS_KEY =
  "orthform-settings";

export type OrthformSettings = {
  theme: ThemePreference;
};

const DEFAULT_SETTINGS: OrthformSettings = {
  theme: "light",
};

// ==================================================
// GET SETTINGS
// ==================================================

export function getSettings(): OrthformSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored =
      window.localStorage.getItem(
        SETTINGS_KEY
      );

    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed =
      JSON.parse(stored);

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// ==================================================
// SAVE SETTINGS
// ==================================================

export function saveSettings(
  settings: Partial<OrthformSettings>
): OrthformSettings {
  const nextSettings = {
    ...getSettings(),
    ...settings,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(nextSettings)
    );
  }

  return nextSettings;
}

// ==================================================
// UPDATE THEME
// ==================================================

export function saveTheme(
  theme: ThemePreference
): OrthformSettings {
  return saveSettings({
    theme,
  });
}