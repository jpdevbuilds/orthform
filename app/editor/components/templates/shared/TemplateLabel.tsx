"use client";

type TemplateLabelProps = {
  children: React.ReactNode;
  color: string;
};

export default function TemplateLabel({
  children,
  color,
}: TemplateLabelProps) {
  return (
    <div
      className="text-[10px] font-semibold uppercase tracking-[0.2em]"
      style={{ color }}
    >
      {children}
    </div>
  );
}