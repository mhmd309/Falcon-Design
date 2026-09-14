"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const HERO_VIDEOS = ["/slidehero_01.mp4", "/slidehero_02.mp4"] as const;

export function HeroMedia({ alt }: { alt: string }) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const src = HERO_VIDEOS[index];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      if (reduce) {
        video.pause();
        return;
      }
      void video.play().catch(() => undefined);
    };

    play();
    video.addEventListener("loadeddata", play);

    const onEnded = () => {
      setIndex((current) => (current + 1) % HERO_VIDEOS.length);
    };
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("ended", onEnded);
    };
  }, [src, reduce]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="absolute inset-0 h-full w-full object-cover object-center"
      autoPlay={!reduce}
      muted
      playsInline
      preload="auto"
      aria-label={alt}
    />
  );
}
