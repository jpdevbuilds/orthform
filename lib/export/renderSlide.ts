import { toPng } from "html-to-image";

export async function renderSlide(
  element: HTMLElement,
  filename: string
): Promise<void> {
  if (!element) {
    throw new Error(
      "Export target was not found."
    );
  }

  const dataUrl = await toPng(element, {
    width: 1080,
    height: 1350,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: "transparent",
  });

  const link =
    document.createElement("a");

  link.download = filename;
  link.href = dataUrl;

  document.body.appendChild(link);

  link.click();

  link.remove();
}