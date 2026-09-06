"use client";

type AuthorityCornerProps = {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color: string;
};

export default function AuthorityCorner({
  position,
  color,
}: AuthorityCornerProps) {
  const positionClasses = {
    "top-left": "left-6 top-6 border-l-2 border-t-2",
    "top-right": "right-6 top-6 border-r-2 border-t-2",
    "bottom-left": "bottom-6 left-6 border-b-2 border-l-2",
    "bottom-right": "bottom-6 right-6 border-b-2 border-r-2",
  };

  return (
    <div
      className={`absolute h-5 w-5 ${positionClasses[position]}`}
      style={{ borderColor: color }}
    />
  );
}