/** Inline script — applies theme before paint to avoid flash */
export const themeInitScript = `
(function () {
  try {
    var key = "hm_theme_pref";
    var pref = localStorage.getItem(key) || "auto";
    if (pref !== "light" && pref !== "dark" && pref !== "auto") pref = "auto";
    var hour = new Date().getHours();
    var auto = hour >= 6 && hour < 19 ? "light" : "dark";
    var theme = pref === "auto" ? auto : pref;
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-theme-pref", pref);
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;
