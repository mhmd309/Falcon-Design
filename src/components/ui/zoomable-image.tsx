"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.35;

type ZoomableImageProps = {
  src: string;
  alt: string;
  unoptimized?: boolean;
  className?: string;
  zoomInLabel: string;
  zoomOutLabel: string;
  resetZoomLabel: string;
  /** Change this when the image changes to reset zoom/pan. */
  resetKey?: string | number;
};

export function ZoomableImage({
  src,
  alt,
  unoptimized = false,
  className,
  zoomInLabel,
  zoomOutLabel,
  resetZoomLabel,
  resetKey,
}: ZoomableImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const pinchRef = useRef<{
    distance: number;
    scale: number;
  } | null>(null);
  const lastTapRef = useRef(0);

  const commit = useCallback((nextScale: number, nextOffset: { x: number; y: number }) => {
    scaleRef.current = nextScale;
    offsetRef.current = nextOffset;
    setScale(nextScale);
    setOffset(nextOffset);
  }, []);

  const reset = useCallback(() => {
    dragRef.current = null;
    pinchRef.current = null;
    setDragging(false);
    commit(1, { x: 0, y: 0 });
  }, [commit]);

  useEffect(() => {
    reset();
  }, [resetKey, src, reset]);

  const clampOffset = useCallback((nextScale: number, x: number, y: number) => {
    const el = containerRef.current;
    if (!el || nextScale <= 1) return { x: 0, y: 0 };
    const { width, height } = el.getBoundingClientRect();
    const maxX = ((nextScale - 1) * width) / 2;
    const maxY = ((nextScale - 1) * height) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const applyZoom = useCallback(
    (nextScale: number, originX?: number, originY?: number) => {
      const el = containerRef.current;
      const currentScale = scaleRef.current;
      const currentOffset = offsetRef.current;
      const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
      if (!el) return;
      if (Math.abs(clamped - currentScale) < 0.001) {
        if (clamped === 1) commit(1, { x: 0, y: 0 });
        return;
      }

      const rect = el.getBoundingClientRect();
      const cx = originX ?? rect.width / 2;
      const cy = originY ?? rect.height / 2;
      const ratio = clamped / currentScale;
      const nextOffset =
        clamped === 1
          ? { x: 0, y: 0 }
          : clampOffset(
              clamped,
              (currentOffset.x - cx) * ratio + cx,
              (currentOffset.y - cy) * ratio + cy,
            );

      commit(clamped, nextOffset);
    },
    [clampOffset, commit],
  );

  const zoomBy = useCallback(
    (delta: number) => {
      applyZoom(scaleRef.current + delta);
    },
    [applyZoom],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      applyZoom(
        scaleRef.current + delta,
        e.clientX - rect.left,
        e.clientY - rect.top,
      );
    };

    const distance = (a: Touch, b: Touch) => {
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      return Math.hypot(dx, dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        dragRef.current = null;
        setDragging(false);
        pinchRef.current = {
          distance: distance(e.touches[0], e.touches[1]),
          scale: scaleRef.current,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const nextDistance = distance(e.touches[0], e.touches[1]);
        const ratio = nextDistance / pinchRef.current.distance;
        applyZoom(pinchRef.current.scale * ratio);
      }
    };

    const onTouchEnd = () => {
      pinchRef.current = null;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [applyZoom]);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const now = Date.now();
      if (now - lastTapRef.current < 280) {
        lastTapRef.current = 0;
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (scaleRef.current > 1) {
          reset();
        } else {
          applyZoom(2.2, e.clientX - rect.left, e.clientY - rect.top);
        }
        return;
      }
      lastTapRef.current = now;

      if (scaleRef.current <= 1) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originX: offsetRef.current.x,
        originY: offsetRef.current.y,
      };
    },
    [applyZoom, reset],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId || scaleRef.current <= 1) return;
      commit(
        scaleRef.current,
        clampOffset(
          scaleRef.current,
          drag.originX + (e.clientX - drag.startX),
          drag.originY + (e.clientY - drag.startY),
        ),
      );
    },
    [clampOffset, commit],
  );

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
      setDragging(false);
    }
  }, []);

  const canZoomOut = scale > MIN_SCALE + 0.01;
  const canZoomIn = scale < MAX_SCALE - 0.01;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className={cn(
          "relative h-full w-full overflow-hidden touch-none select-none",
          scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
            transition: dragging ? "none" : "transform 120ms ease-out",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="pointer-events-none object-contain"
            priority
            draggable={false}
            unoptimized={unoptimized}
          />
        </div>
      </div>

      <div
        className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-md bg-black/60 p-1.5 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
          onClick={() => zoomBy(-ZOOM_STEP)}
          disabled={!canZoomOut}
          aria-label={zoomOutLabel}
          title={zoomOutLabel}
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
          onClick={reset}
          disabled={!canZoomOut}
          aria-label={resetZoomLabel}
          title={resetZoomLabel}
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
          onClick={() => zoomBy(ZOOM_STEP)}
          disabled={!canZoomIn}
          aria-label={zoomInLabel}
          title={zoomInLabel}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
