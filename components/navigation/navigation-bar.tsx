import { ThemeSwitcher } from "./theme-switcher";
import { AuthButton } from "../auth/auth-button";
import Link from "next/link";
import NavigationLinks from "./navigation-links";

const NavigationBar = () => {
  
  return (
    <nav className="w-full flex justify-between border-b border-b-foreground/10 py-2 px-4 absolute top-0">
      <Link className="font-semibold text-2xl" href={"/"}>
        BudgetBuddy
      </Link>
      <NavigationLinks />
      <div className="flex gap-5 items-center">
        <ThemeSwitcher />
        <AuthButton />
      </div>
    </nav>
  );
};

export default NavigationBar;
