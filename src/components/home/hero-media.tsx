"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const VIDEO_SRC = "/slidehero.mp4";
const POSTER_SRC = "/slidehero.jpg";

export function HeroMedia({ alt }: { alt: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Image
        src={POSTER_SRC}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    );
  }

  return (
    <>
      {/* Poster while the first frame loads */}
      <Image
        src={POSTER_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER_SRC}
        aria-hidden
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
    </>
  );
}
