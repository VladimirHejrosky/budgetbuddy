"use client";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import { LogoutButton } from "../auth/logout-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";
import { useState } from "react";

const NavigationBar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Přehled", active: pathname === "/" },
    {
      href: "/statistics",
      label: "Statistiky",
      active: pathname === "/statistics",
    },
    {
      href: "/transactions",
      label: "Transakce",
      active: pathname === "/transactions",
    },
    {
      href: "/categories",
      label: "Kategorie",
      active: pathname === "/categories",
    },
    {
      href: "/recurring",
      label: "Opakované",
      active: pathname === "/recurring",
    },
  ];

  if (pathname.startsWith("/auth"))
    return (
      <div className="w-full flex justify-center border-b border-b-foreground/10 py-2 px-4 absolute top-0">
        <div className="font-semibold text-2xl">BudgetBuddy</div>
      </div>
    );

  return (
    <nav className="w-full flex justify-between border-b border-b-foreground/10 py-3 px-4 absolute top-0">
      <Link className="font-semibold text-2xl" href={"/"}>
        BudgetBuddy
      </Link>
      <div className="hidden gap-4 items-center md:flex">
        {links.map(({ href, label, active }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-sm font-medium text-foreground hover:text-primary transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex gap-2 items-center">
        <ThemeSwitcher />
        <LogoutButton />
      </div>
      <div className="md:hidden">
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <div className="flex items-center justify-center w-10 h-10">
              <Menu className="w-6 h-6" />
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle />
              <DrawerClose className="absolute top-5 right-6">
                <X className="w-6 h-6"/>
              </DrawerClose>
            </DrawerHeader>
            <div className="flex flex-col gap-8 items-center md:hidden pt-8">
              {links.map(({ href, label, active }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-lg font-medium text-foreground hover:text-primary transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
            <DrawerFooter className="flex flex-row items-center gap-4 justify-around pb-20">
              <LogoutButton />
              <ThemeSwitcher />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
};

export default NavigationBar;
