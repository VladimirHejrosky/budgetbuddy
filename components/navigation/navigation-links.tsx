"use client";
import { cn } from "@/lib/utils";
import { BarChart, Home, List, Repeat } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationLinks = () => {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Přehled", icon: Home, active: pathname === "/" },
    {
      href: "/transactions",
      label: "Transakce",
      icon: List,
      active: pathname === "/transactions",
    },
    {
      href: "/statistics",
      label: "Statistiky",
      icon: BarChart,
      active: pathname === "/statistics",
    },
    {
      href: "/recurring",
      label: "Opakované",
      icon: Repeat,
      active: pathname === "/recurring",
    },
  ];
  return (
    <div className="flex gap-4 items-center">
      {links.map(({ href, label, icon: Icon, active }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors",
            active ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </div>
  );
};

export default NavigationLinks;
