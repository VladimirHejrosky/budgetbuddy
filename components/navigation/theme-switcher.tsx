"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "system") {
      setTheme("light");
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Button variant="ghost" size={"sm"} onClick={toggleTheme}>
      {theme === "dark" ? (
        <Moon key="dark" size={ICON_SIZE} className={"text-muted-foreground"} />
      ) : (
        <Sun key="light" size={ICON_SIZE} className={"text-muted-foreground"} />
      )}
    </Button>
  );
};

export { ThemeSwitcher };
