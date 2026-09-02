# Cursor Avatar reference

Source: Instagram post by Tran Mau Tri Tam (@tranmautritam), built with the Framer AI agent, inspired by dahbiahmed.
https://www.instagram.com/p/Db3SBw8ksxg/?img_index=1

## What the demo shows

- A single centered profile card on an off-white page. White card, about 280px wide, rounded corners near 20px, soft shadow.
- Top: a square headshot with rounded corners. Below: bold name with a green verified check, a one-line grey tagline, a row with two counts, and a small "Follow +" pill button.
- Type: clean geometric sans (Inter-like). Palette: white, near-black text, mid grey, light grey page, one green accent.
- Interaction: the headshot swaps between nine head poses so the face looks toward the cursor. Swaps are instant. Spring smoothing and hysteresis stop flicker. A small wobble inside each pose keeps motion continuous. Click toggles a second sprite set (t-shirt colour).
- Second slide: the Framer editor with the generated code and a property panel. Panel values seen: Tracking Radius 264, Visual Smoothness 0.07, Pose Smoothness 0.11, Direction Threshold 0.8, Hysteresis 0.02, Tracking Strength 2, Return Speed 0.1. A follow-up prompt asked for a 480ms polished transition.

## Original prompt (verbatim, from the caption)

Build a reusable Framer component called Cursor Avatar.
The component creates the illusion that a static illustrated avatar follows the user's cursor.
This is NOT a 3D rotation effect. This is NOT moving the avatar.
Instead, the component swaps between a predefined set of avatar images representing different head directions.
The component accepts exactly nine image properties: Center, Left, Right, Up, Down, Up Left, Up Right, Down Left, Down Right
Track the global cursor position relative to the center of the avatar. Normalize X and Y into the range [-1, 1]. Clamp the values to prevent excessive movement.
Apply spring smoothing so the tracking feels soft and natural instead of directly following the mouse.
Use the smoothed coordinates to determine the closest directional pose.
Do not rapidly switch images. Only change pose after crossing directional thresholds to avoid flickering.
Preload all images. Render only the currently active image.
When changing pose, avoid opacity crossfades. Switch instantly after the smoothed tracking reaches the next direction.
While remaining within the same pose, subtly interpolate the current image using tiny transforms: translateX ±2px, translateY ±2px, rotate ±1°, scale up to 1.01
These transforms should be driven by the cursor position and only serve to make movement feel continuous between discrete poses.
When the cursor leaves the tracking radius, smoothly return to the Center pose.
Expose these controls: Tracking Radius, Smoothness, Spring Stiffness, Spring Damping, Return Speed, Tracking Strength, Idle Pose, Enable Page Tracking, Enable Hover Only
The interaction should feel premium, responsive, and organic, similar to modern AI avatar demos.
The component must remain lightweight, reusable, and easy to duplicate inside Framer projects.
To make it clickable, you can change the t-shirt color like in the demo.
Ask for a follow-up: Now make the avatar clickable. In the settings panel, add one more upload image field that allows the user to upload a secondar[y sprite...] (caption truncated here)

## Decisions taken for this site

- Hero centrepiece. Real photos of Emil, nine Poses, one outfit.
- Port to React + Framer Motion. Framer the site builder is a visual reference only.
- The click toggle (second sprite set) is out of scope for v1.
