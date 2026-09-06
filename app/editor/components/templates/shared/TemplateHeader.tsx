"use client";

type TemplateHeaderProps = {
  systemName: string;
  templateName: string;
  muted: string;
};

export default function TemplateHeader({
  systemName,
  templateName,
  muted,
}: TemplateHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: muted }}
      >
        {systemName}
      </span>

      <span
        className="text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: muted }}
      >
        {templateName}
      </span>
    </div>
  );
}