"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface AppSidebarProps {
  children?: React.ReactNode;
}

export default function AppSidebar({ children }: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { name: "Dashboard", href: "/app/dashboard", icon: HomeIcon },
    { name: "Transactions", href: "/app/transactions", icon: CreditCardIcon },
    { name: "Budget Autopilot", href: "/app/budget", icon: ChartBarIcon },
    { name: "Subscriptions", href: "/app/subscriptions", icon: ArrowPathIcon },
    { name: "Accounts", href: "/app/accounts", icon: BanknotesIcon },
    { name: "Cashflow", href: "/app/cashflow", icon: ArrowTrendingUpIcon },
    { name: "Portfolio", href: "/app/portfolio", icon: ChartPieIcon },
    { name: "Settings", href: "/app/settings", icon: Cog6ToothIcon },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("demoMode");
    }
    router.push("/");
    setIsOpen(false);
  };

  const NavButton = ({
    name,
    href,
    icon: Icon,
    isDanger,
  }: {
    name: string;
    href?: string;
    icon: any;
    isDanger?: boolean;
  }) => {
    const isActive = pathname === href;
    
    return (
      <button
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
          isDanger
            ? "text-red-400 hover:bg-red-500/10"
            : isActive
            ? "bg-violet-500/20 text-violet-300 font-semibold"
            : "text-white/70 hover:bg-white/5 hover:text-white"
        }`}
        onClick={() => {
          if (href) {
            handleNavigation(href);
          } else if (isDanger) {
            handleLogout();
          }
        }}
      >
        <Icon className="h-5 w-5" />
        <span>{name}</span>
      </button>
    );
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl border border-white/10 bg-[#0b0b10] hover:bg-white/5 transition"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6 text-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setIsOpen(false)}
          />
          <aside className="relative z-50 w-72 bg-[#0b0b10] border-r border-white/10 min-h-screen p-6 space-y-6 shadow-2xl"> 
            <button
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 transition"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6 text-white/70" />
            </button>

            <div className="pt-8">
              <h2 className="text-xl font-bold text-white mb-1">MyAI Bank</h2>
              <p className="text-xs text-white/50">Financial Intelligence</p>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <NavButton
                  key={item.name}
                  name={item.name}
                  href={item.href}
                  icon={item.icon}
                />
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10">
              <NavButton
                name="Logout"
                icon={ArrowRightOnRectangleIcon}
                isDanger
              />
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden lg:block fixed left-0 top-0 w-72 bg-[#0b0b10] border-r border-white/10 min-h-screen p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">MyAI Bank</h2>
          <p className="text-xs text-white/50">Financial Intelligence</p>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavButton
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </nav>

        <div className="pt-4 border-t border-white/10">
          <NavButton
            name="Logout"
            icon={ArrowRightOnRectangleIcon}
            isDanger
          />
        </div>
      </aside>

      <div className="lg:ml-72 min-h-screen">
        {children}
      </div>
    </>
  );
}