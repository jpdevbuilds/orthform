"use client";

type DesktopWorkspaceFrameProps = {
  structureWidth: string;
  inspectorWidth: string;
  children: React.ReactNode;
};

export default function DesktopWorkspaceFrame({
  structureWidth,
  inspectorWidth,
  children,
}: DesktopWorkspaceFrameProps) {
  return (
    <div
      className="
        mx-auto
        grid
        h-[calc(100vh-105px)]
        w-full
        max-w-[1440px]
        overflow-hidden
        rounded-2xl
        border
        border-[var(--app-border)]
        bg-[var(--app-bg)]
        shadow-[0_18px_60px_rgba(0,0,0,0.06)]
        transition-all
        duration-300
      "
      style={{
        gridTemplateColumns: `
          ${structureWidth}
          minmax(0, 1fr)
          ${inspectorWidth}
        `,
      }}
    >
      {children}
    </div>
  );
}