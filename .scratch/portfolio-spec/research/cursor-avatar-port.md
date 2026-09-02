# Research: Cursor Avatar port to React + Framer Motion

Ticket: `../issues/02-cursor-avatar-port.md`
Reference: `../assets/cursor-avatar-reference.md`
Date: 2026-09-02

## Summary

The Cursor Avatar is one square frame that shows one of nine Pose photos. A hook reads the pointer position, normalizes it to the range [-1, 1] around the avatar center, and smooths it with a spring. The smoothed vector selects the Pose. A dot-product threshold with hysteresis stops flicker. Small transforms that follow the same smoothed vector give continuous motion inside a Pose. All nine Poses load and decode on mount. When the pointer leaves the tracking radius, the target goes to zero and the spring returns the avatar to Center. Reduced motion shows the Center Pose only. On touch devices, the avatar drifts slowly between Poses.

The library is now named Motion. The npm package is `motion` and the React import path is `motion/react`. The `framer-motion` package still works as an alias. All hook names in the ticket are current: `useMotionValue`, `useSpring`, `useTransform`, `useReducedMotion`, and `MotionConfig` with the `reducedMotion` prop (source: https://motion.dev/docs/react-use-spring, https://motion.dev/docs/react-motion-config).

## Component contract

Component: `CursorAvatar`. One file with one hook (`useCursorAvatar`) and one presentational component.

| Prop | Type | Default | Note |
|---|---|---|---|
| `poses` | `Record<Pose, string>` | required | One URL for each of the nine Poses. |
| `alt` | `string` | required | Alt text for the headshot. |
| `size` | `number` | `280` | Rendered width and height in CSS px. Square. |
| `trackingRadius` | `number` | `264` | Distance in px from the avatar center where the normalized vector reaches 1. From the reference panel. |
| `trackingStrength` | `number` | `2` | Multiplier on the normalized vector before the clamp. Higher values reach the edge Poses sooner. From the reference panel. |
| `stiffness` | `number` | `120` | Spring stiffness for the smoothed vector. |
| `damping` | `number` | `20` | Spring damping for the smoothed vector. |
| `directionThreshold` | `number` | `0.8` | Minimum dot score for a directional Pose. From the reference panel. |
| `hysteresis` | `number` | `0.05` | Score margin a new Pose must win by before a swap. The reference used 0.02. See Pose selection. |
| `deadZone` | `number` | `0.25` | Below this magnitude the avatar shows the idle Pose. |
| `idlePose` | `Pose` | `"Center"` | Pose at rest and under reduced motion. |
| `trackPage` | `boolean` | `true` | `true` listens on `window`. `false` listens on the avatar element only (the "hover only" mode of the reference). |
| `touchMode` | `"drift" \| "lastTap" \| "none"` | `"drift"` | Behavior when the primary pointer is coarse. |

Type: `type Pose = "Center" | "Left" | "Right" | "Up" | "Down" | "UpLeft" | "UpRight" | "DownLeft" | "DownRight"`.

Dropped from the reference panel: `Smoothness` (the spring options replace it), `Return Speed` (v1 uses the same spring for return, see below), and the second sprite set (out of scope for v1). Wobble amplitudes are constants, not props.

## Algorithm

1. On mount, preload all nine Poses (see Preloading).
2. On mount, read `useReducedMotion()`. If it returns `true`, render `idlePose` and skip every step below (source: https://motion.dev/docs/react-use-reduced-motion).
3. Create two raw motion values `rawX` and `rawY` with `useMotionValue(0)`.
4. Create two smoothed values with `useSpring(rawX, { stiffness, damping })` and the same for Y. `useSpring` tracks another motion value when you pass it as the source (source: https://motion.dev/docs/react-use-spring).
5. Add one `pointermove` listener with `{ passive: true }` on `window` (or on the element when `trackPage` is `false`). `pointermove` fires for mouse, pen, and touch. It is Baseline widely available (source: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event).
6. In the listener, read `getBoundingClientRect()` of the avatar. Compute the center. Compute `dx = clientX - cx` and `dy = clientY - cy`.
7. Normalize: `nx = clamp(dx / trackingRadius * trackingStrength, -1, 1)`. Same for Y. Call `rawX.set(nx)` and `rawY.set(ny)`.
8. If `hypot(dx, dy) > trackingRadius`, call `rawX.set(0)` and `rawY.set(0)` instead. This is the return to Center.
9. Subscribe to the smoothed values with `useMotionValueEvent(smoothX, "change", ...)` (source: https://motion.dev/docs/react-use-motion-value-event). On each change, run Pose selection. When the Pose changes, set React state. This is the only React re-render in the loop.
10. Derive the wobble transforms from the smoothed values with `useTransform(() => ...)` and pass them to `motion.img` through `style`. These never re-render React (source: https://motion.dev/docs/react-use-transform).
11. Render the Pose frame. Swap the visible Pose instantly, with no opacity transition.

Spring defaults for reference: `damping` 10, `mass` 1, `restSpeed` 0.1, `restDelta` 0.01 (source: https://motion.dev/docs/spring). The docs list `stiffness` as 1 on that page, but the long-standing default is 100. Set `stiffness` and `damping` explicitly to avoid the question.

## Pose selection with thresholds and hysteresis

Inputs: smoothed `x` and `y` in [-1, 1]. Current Pose `cur`.

1. Compute `m = hypot(x, y)`.
2. If `m < deadZone`, the candidate is `idlePose`. Go to step 6.
3. Compute the unit vector `u = (x / m, y / m)`.
4. For each of the eight directional Poses, compute `score = dot(u, dir[pose])`. `dir` holds the eight unit vectors, for example `Up = (0, -1)` and `DownRight = (0.7071, 0.7071)`. Screen Y points down, so `Up` has a negative Y.
5. The candidate is the Pose with the highest score. If that score is below `directionThreshold`, keep `cur` and stop.
6. Hysteresis. If the candidate equals `cur`, stop. Otherwise, swap only when the candidate wins by a margin:
   - Directional to directional: swap when `score(candidate) - score(cur) > hysteresis`.
   - Idle to directional: swap when `m > deadZone + hysteresis`.
   - Directional to idle: swap when `m < deadZone - hysteresis`.

Why these numbers. Two neighbor directions are 45 degrees apart. At the sector boundary both scores are equal. A margin of 0.05 moves the swap point about 7 degrees past the boundary. The reference used 0.02, which is about 3 degrees. The spring does most of the anti-flicker work. The margin only stops swaps when the pointer sits on a boundary. Tune between 0.02 and 0.08 in the prototype.

The dead zone with a band of plus or minus `hysteresis` stops the Center Pose from blinking when the pointer rests near the avatar.

## Wobble transforms

The wobble follows the smoothed vector, not the raw pointer. Amplitudes come from the reference prompt:

| Transform | Formula | Range |
|---|---|---|
| `x` | `smoothX * 2` | plus or minus 2 px |
| `y` | `smoothY * 2` | plus or minus 2 px |
| `rotate` | `smoothX * 1` | plus or minus 1 degree |
| `scale` | `1 + 0.01 * min(1, hypot(smoothX, smoothY))` | 1.00 to 1.01 |

Build each as `useTransform(() => ...)`. Pass them to `<motion.div style={{ x, y, rotate, scale }} />` that wraps the Pose images. Motion writes these to the element on animation frames without React renders. The frame moves and the Pose swaps at the same smoothed position, so the swap reads as one continuous motion.

## Preloading

Goal: no blank frame on the first swap of each Pose.

1. On mount, for each Pose create `new Image()`, set `src`, and call `await img.decode()`. `decode()` resolves when the image is decoded and safe to show. It is Baseline widely available since January 2020 (source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode).
2. Show the Center Pose at once. It is the same URL that the frame renders, so the browser shows it as soon as it arrives.
3. Do not start tracking until all nine promises settle. Use `Promise.allSettled` so one failed image does not block the others.

Render strategy. The reference prompt says "render only the currently active image". A swap of the `src` on a single `<img>` is the direct port. The browser does not guarantee that a decoded bitmap stays in memory after the `Image()` object is dropped, so a swap can still show a one-frame blank on a slow device. Safer: render all nine `<img>` elements stacked in one square container and toggle `visibility` so only the active Pose is visible. The browser keeps all nine decoded. Nine images at about 30 KB each is a small cost. Recommend the stacked render. Keep the `Image().decode()` pass as well, so the first swap is ready before tracking starts.

`<link rel="preload" as="image">` in `index.html` is useful for the Center Pose only, because it is the hero image and part of the first paint. Do not preload all nine in the head. MDN advises against preloads for multiple candidate resources, and browsers warn in the console about preloads that the page does not use soon (source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload).

## Return to Center

Trigger cases:

- The pointer distance from the avatar center is greater than `trackingRadius` (step 8 above).
- The pointer leaves the document. Listen to `pointerleave` on `document.documentElement` and also `blur` on `window`.
- `trackPage` is `false` and the pointer leaves the avatar element (`pointerleave` on the element).

Action: `rawX.set(0)` and `rawY.set(0)`. The spring animates the smoothed values back to zero. When the magnitude falls under `deadZone - hysteresis`, Pose selection swaps to `idlePose`. The wobble also returns to zero, so the frame settles.

The reference exposes `Return Speed` as a separate value. `useSpring` takes one options object, so a separate return spring needs a second spring pair or `animate(rawX, 0, {...})` from `motion`. Neither is needed for v1. The one spring reads well in both directions. If the return feels too fast in the prototype, lower `stiffness` for both directions first.

## Reduced-motion fallback

Two layers:

1. In the hook, call `useReducedMotion()`. It returns `true` when the OS setting is on, and it re-renders on change (source: https://motion.dev/docs/react-use-reduced-motion). When `true`, render `idlePose` as a plain `<img>`, attach no listeners, and skip the touch drift. This matches the map decision "the avatar goes static".
2. At the app root, wrap the tree in `<MotionConfig reducedMotion="user">`. This disables transform and layout animations on all `motion` components and keeps opacity and color animations (source: https://motion.dev/docs/react-motion-config). This layer covers the reveals and the scroll moments. It does not stop the hook from writing motion values, so layer 1 is still required.

## Touch options

Detect a coarse primary pointer with `window.matchMedia("(pointer: coarse)").matches`. The `pointer` media feature tests the primary input, `any-pointer` tests any input (source: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer). Use `pointer`, because a laptop with a touchscreen still has a mouse or trackpad as the primary input.

| Aspect | Option A: follow last tap | Option B: slow idle drift |
|---|---|---|
| Input | `pointerdown` on `window`. Set the raw target from the tap position. The spring smooths. The Pose holds until the next tap. | A timer. Every 2.5 to 4 s pick a Pose that neighbors the current one, set the raw target to `0.9 * dir[pose]`, and let the spring move. |
| What the Reader sees | The avatar looks at the last tap. Most Readers scroll and never tap the hero. They see a static Center Pose. | The avatar looks around slowly with no input. The effect is visible in the first seconds. |
| Code size | About 15 lines. | About 30 lines. Needs an `IntersectionObserver` to pause when the hero is off screen, and a cleanup on unmount. |
| Risks | Taps on links and buttons also move the avatar. Feels random. Scroll gestures do not give a useful `pointerdown`. | Motion without input. Must stop under reduced motion (layer 1 covers this). Must pause off screen to save battery. |
| Match with the demo | Weak. The demo is about response to input. | Strong. Shows the nine Poses and the swap quality. |

Recommendation: Option B, slow idle drift. The Reader on a phone is often a recruiter who reads the top fold and does not touch the hero. Drift shows the Cursor Avatar in that window. Add the tap as a small bonus: a `pointerdown` on the avatar element itself sets the target to the tap and pauses drift for 4 s. Do not listen for taps on the whole page.

Drift details. Pick the next Pose from the neighbors of the current one so the head never jumps across the face. Return to Center every third move. Randomize the interval between 2.5 and 4 s so it does not read as a metronome. Pause when `document.visibilityState` is `hidden` and when the hero is out of view.

## Image format and size for nine Poses

- Crop: square. The reference card renders the headshot at about 280 px wide.
- Export size: 560 by 560 px, which is 2x for the 280 px frame. Skip 3x. The gain on a 3x phone is small for a photo at this size, and nine files at 3x triple the download.
- Format: WebP, lossy, quality 80. Expect 25 to 40 KB per Pose and about 300 KB for nine. WebP has broad support in all current browsers (source: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types).
- AVIF is about half the size of WebP but has no progressive rendering and is newer in Safari. The component swaps images in JavaScript, so a `<picture>` fallback does not apply. One format keeps the code simple. Revisit AVIF after v1 if the download budget needs it.
- Set `width` and `height` attributes on every `<img>` to reserve layout space.
- The Center Pose is the LCP candidate. Give it `fetchpriority="high"` and the `<link rel="preload">` in the head. Give the other eight `loading="eager"` with default priority.
- Name files by Pose: `pose-center.webp`, `pose-up-left.webp`, and so on. This makes the `poses` prop a literal object.
- Shooting requirements live in ticket 03: fixed camera, same framing, same light, plain background, one outfit, only the head turns.

## Hook sketch

Illustrative only. Not the build.

```ts
import { useEffect, useState } from "react";
import { useMotionValue, useSpring, useTransform, useMotionValueEvent, useReducedMotion } from "motion/react";

export type Pose = "Center" | "Left" | "Right" | "Up" | "Down" | "UpLeft" | "UpRight" | "DownLeft" | "DownRight";
type Dir = Exclude<Pose, "Center">;

const DIR: Record<Dir, [number, number]> = {
  Left: [-1, 0], Right: [1, 0], Up: [0, -1], Down: [0, 1],
  UpLeft: [-0.7071, -0.7071], UpRight: [0.7071, -0.7071],
  DownLeft: [-0.7071, 0.7071], DownRight: [0.7071, 0.7071],
};

type Opts = {
  ref: React.RefObject<HTMLElement>; trackingRadius: number; trackingStrength: number;
  stiffness: number; damping: number; directionThreshold: number; hysteresis: number;
  deadZone: number; idlePose: Pose;
};

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function useCursorAvatar(o: Opts) {
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: o.stiffness, damping: o.damping });
  const y = useSpring(rawY, { stiffness: o.stiffness, damping: o.damping });
  const [pose, setPose] = useState<Pose>(o.idlePose);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = o.ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const out = Math.hypot(dx, dy) > o.trackingRadius;
      rawX.set(out ? 0 : clamp((dx / o.trackingRadius) * o.trackingStrength));
      rawY.set(out ? 0 : clamp((dy / o.trackingRadius) * o.trackingStrength));
    };
    const onLeave = () => { rawX.set(0); rawY.set(0); };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, o.ref, o.trackingRadius, o.trackingStrength, rawX, rawY]);

  const select = () => {
    const sx = x.get(), sy = y.get(), m = Math.hypot(sx, sy);
    setPose((cur) => {
      if (m < o.deadZone - o.hysteresis) return o.idlePose;
      if (cur === o.idlePose && m < o.deadZone + o.hysteresis) return cur;
      const score = (p: Pose) => p === "Center" ? -1 : (sx * DIR[p][0] + sy * DIR[p][1]) / m;
      const best = (Object.keys(DIR) as Dir[]).reduce((a, b) => (score(b) > score(a) ? b : a));
      if (score(best) < o.directionThreshold) return cur;
      if (cur !== o.idlePose && score(best) - score(cur) <= o.hysteresis) return cur;
      return best;
    });
  };
  useMotionValueEvent(x, "change", select);
  useMotionValueEvent(y, "change", select);

  const style = {
    x: useTransform(() => x.get() * 2),
    y: useTransform(() => y.get() * 2),
    rotate: useTransform(() => x.get() * 1),
    scale: useTransform(() => 1 + 0.01 * Math.min(1, Math.hypot(x.get(), y.get()))),
  };
  return { pose: reduced ? o.idlePose : pose, style, reduced };
}
```

## Open decisions for the parent

- Confirm the touch recommendation: idle drift, with tap-on-avatar as a bonus. This closes the "Final touch behaviour" item in the map.
- Confirm the stacked-render deviation from the reference prompt ("render only the active image").
- Confirm WebP only at 560 px for v1, no AVIF.

## Sources

- useSpring: https://motion.dev/docs/react-use-spring
- useTransform: https://motion.dev/docs/react-use-transform
- useMotionValueEvent: https://motion.dev/docs/react-use-motion-value-event
- Motion value API: https://motion.dev/docs/motion-value
- useReducedMotion: https://motion.dev/docs/react-use-reduced-motion
- MotionConfig and reducedMotion: https://motion.dev/docs/react-motion-config
- Accessibility guide: https://motion.dev/docs/react-accessibility
- Spring options and defaults: https://motion.dev/docs/spring
- pointermove event: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event
- pointer media feature: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
- rel=preload: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload
- HTMLImageElement.decode: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode
- Image file types: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
