"use client";

import { TextGenerateEffect } from "./text-generate-effect";

export function TextGenerateEffectDemo() {
  const words = `Our AI-powered platform has revolutionized how traders analyze and improve their performance.`;
  return <TextGenerateEffect words={words} />;
}
