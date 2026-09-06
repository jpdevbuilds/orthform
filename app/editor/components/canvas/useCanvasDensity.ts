"use client";

import { countWords } from "@/lib/content/density";

type Slide = {
  title: string;
  body: string;
};

type SlideConstraints = {
  titleMaxWords: number;
  bodyMaxWords: number;
  bodyMaxCharacters: number;
};

export function useCanvasDensity(
  slide: Slide,
  constraints: SlideConstraints
) {
  const titleWords = countWords(slide.title);
  const bodyWords = countWords(slide.body);
  const bodyCharacters = slide.body.trim().length;

  const titleTooLong =
    titleWords > constraints.titleMaxWords;

  const bodyWordsTooLong =
    bodyWords > constraints.bodyMaxWords;

  const bodyCharactersTooLong =
    bodyCharacters >
    constraints.bodyMaxCharacters;

  const bodyTooLong =
    bodyWordsTooLong ||
    bodyCharactersTooLong;

  const bodyPercentage =
    constraints.bodyMaxCharacters > 0
      ? Math.min(
          100,
          Math.round(
            (bodyCharacters /
              constraints.bodyMaxCharacters) *
              100
          )
        )
      : 0;

  const densityStatus = bodyTooLong
    ? "Too dense"
    : bodyPercentage >= 85
    ? "Near limit"
    : "Good fit";

  return {
    titleWords,
    bodyWords,
    bodyCharacters,
    titleTooLong,
    bodyWordsTooLong,
    bodyCharactersTooLong,
    bodyTooLong,
    bodyPercentage,
    densityStatus,
  };
}