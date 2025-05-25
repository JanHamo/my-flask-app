import { useTheme as useThemeContext } from "@/components/ui/theme-provider";

export function useTheme() {
  const context = useThemeContext();
  
  const toggleTheme = () => {
    if (context.theme === "dark") {
      context.setTheme("light");
    } else {
      context.setTheme("dark");
    }
  };
  
  return {
    theme: context.theme,
    setTheme: context.setTheme,
    toggleTheme,
    isDark: context.theme === "dark",
  };
}
