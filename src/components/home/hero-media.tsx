"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const HERO_VIDEOS = ["/slidehero_01.mp4", "/slidehero_02.mp4"] as const;

export function HeroMedia({ alt }: { alt: string }) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = HERO_VIDEOS[index];
    video.load();

    if (reduce) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      /* muted + playsInline usually allows autoplay */
    });
  }, [index, reduce]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;

    const onEnded = () => {
      setIndex((current) => (current + 1) % HERO_VIDEOS.length);
    };

    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [reduce]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-center"
      muted
      playsInline
      preload="auto"
      aria-label={alt}
    />
  );
}
