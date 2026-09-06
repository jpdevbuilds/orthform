"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Archive,
  House,
  Layers,
  LayoutTemplate,
  Plus,
  Settings,
} from "lucide-react";
import ThemeController from "./ThemeController";

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: House,
  },
  {
    name: "Create",
    href: "/create",
    icon: Plus,
  },
  {
    name: "Archive",
    href: "/archive",
    icon: Archive,
  },
  {
    name: "Brands",
    href: "/brands",
    icon: Layers,
  },
  {
    name: "Templates",
    href: "/templates",
    icon: LayoutTemplate,
  },
];

const settingsItem = {
  name: "Settings",
  href: "/settings",
  icon: Settings,
};

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(
    pathname.startsWith("/editor")
  );

  const sidebarWidth = collapsed ? "64px" : "240px";

  return (
    <div
      className="
        min-h-screen
        bg-[var(--app-bg)]
        text-[var(--app-ink)]
        transition-colors
        duration-300
      "
    >
      <ThemeController />

      {/* ==================================================
          DESKTOP APPLICATION SHELL
          ================================================== */}

      <div className="flex min-h-screen">

        {/* ==================================================
            MAIN NAVIGATION
            ================================================== */}

        <aside
          className="
            sticky
            top-0
            hidden
            h-screen
            shrink-0
            border-r
            border-[var(--app-border)]
            bg-[var(--app-bg)]
            transition-[width,background-color,border-color]
            duration-200
            ease-out
            lg:block
          "
          style={{
            width: sidebarWidth,
          }}
        >
          <div
            className={`
              flex
              h-full
              flex-col
              ${
                collapsed
                  ? "items-center px-2 py-5"
                  : "px-5 py-6"
              }
            `}
          >
            {/* BRAND */}

            <div
              className={`
                flex
                w-full
                items-center
                ${
                  collapsed
                    ? "justify-center"
                    : "justify-between"
                }
              `}
            >
              {collapsed ? (
                <Link
                  href="/"
                  aria-label="Orthform home"
                  title="Orthform"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--app-active)]
                    text-[var(--app-active-ink)]
                    transition-colors
                    duration-300
                  "
                >
                  <span className="text-[11px] font-bold tracking-[0.08em]">
                    O
                  </span>
                </Link>
              ) : (
                <Link
                  href="/"
                  className="
                    text-sm
                    font-semibold
                    tracking-[0.2em]
                    text-[var(--app-heading)]
                    transition-colors
                    duration-300
                  "
                >
                  ORTHFORM
                </Link>
              )}
            </div>

            {/* COLLAPSE */}

            <button
              type="button"
              onClick={() =>
                setCollapsed((value) => !value)
              }
              aria-label={
                collapsed
                  ? "Expand navigation"
                  : "Collapse navigation"
              }
              title={
                collapsed
                  ? "Expand navigation"
                  : "Collapse navigation"
              }
              className={`
                mt-8
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--app-border)]
                text-xs
                text-[var(--app-muted)]
                transition-colors
                hover:border-[var(--app-border-strong)]
                hover:bg-[var(--app-hover)]
                hover:text-[var(--app-ink)]
                ${
                  collapsed
                    ? ""
                    : "self-end"
                }
              `}
            >
              {collapsed ? "→" : "←"}
            </button>

            {/* NAVIGATION */}

            <nav
              aria-label="Main navigation"
              className={`
                mt-8
                w-full
                space-y-1
                ${
                  collapsed
                    ? "flex flex-col items-center"
                    : ""
                }
              `}
            >
              {navigation.map((item) => {
                const active =
                  pathname === item.href;

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={
                      collapsed
                        ? item.name
                        : undefined
                    }
                    className={`
                      flex
                      items-center
                      rounded-lg
                      transition-colors
                      ${
                        collapsed
                          ? "h-9 w-9 justify-center"
                          : "gap-3 px-3 py-2 text-sm"
                      }
                      ${
                        active
                          ? "bg-[var(--app-active)] text-[var(--app-active-ink)]"
                          : "text-[var(--app-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-ink)]"
                      }
                    `}
                  >
                    <Icon
                      size={collapsed ? 17 : 16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    {!collapsed && (
                      <span>{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* SETTINGS */}

            <div
              className={`
                mt-auto
                w-full
                ${
                  collapsed
                    ? "flex justify-center"
                    : ""
                }
              `}
            >
              <Link
                href={settingsItem.href}
                title={
                  collapsed
                    ? settingsItem.name
                    : undefined
                }
                className={`
                  flex
                  items-center
                  rounded-lg
                  text-sm
                  text-[var(--app-muted)]
                  transition-colors
                  hover:bg-[var(--app-hover)]
                  hover:text-[var(--app-ink)]
                  ${
                    collapsed
                      ? "h-9 w-9 justify-center"
                      : "gap-3 px-3 py-2"
                  }
                `}
              >
                <Settings
                  size={collapsed ? 17 : 16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {!collapsed && (
                  <span>Settings</span>
                )}
              </Link>
            </div>
          </div>
        </aside>

        {/* ==================================================
            APPLICATION WORKSPACE
            ================================================== */}

        <div className="min-w-0 flex-1">
          <main className="min-h-screen min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* ==================================================
          MOBILE NAVIGATION
          ================================================== */}

      <nav
        aria-label="Mobile navigation"
        className="
          fixed
          inset-x-0
          bottom-0
          z-50
          border-t
          border-[var(--app-border)]
          bg-[var(--app-bg)]/95
          px-2
          py-2
          backdrop-blur
          transition-colors
          duration-300
          lg:hidden
        "
      >
        <div
          className="
            flex
            w-full
            items-center
            justify-around
            gap-1
          "
        >
          {[...navigation, settingsItem].map((item) => {
            const active =
              pathname === item.href;

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.name}
                className={`
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-lg
                  px-1
                  py-2
                  transition-colors
                  ${
                    active
                      ? "bg-[var(--app-active)] text-[var(--app-active-ink)]"
                      : "text-[var(--app-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-ink)]"
                  }
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <span className="text-[10px] leading-none">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}