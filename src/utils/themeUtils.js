// src/utils/themeUtils.js
export const applyTheme = (theme) => {
    const root = document.documentElement;
  
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--border-radius', theme.borderRadius);
    root.style.setProperty('--border-size', theme.borderSize);
    root.style.setProperty('--gap-between-elements', theme.gapBetweenElements);
    root.style.setProperty('--font-family', theme.font);
  };
  