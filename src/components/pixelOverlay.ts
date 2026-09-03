// Two-colour pixel overlay for the Cursor Avatar. Tokens from src/index.css.
const ACCENT = [22, 163, 74] // --color-accent #16a34a
const BG = [250, 250, 249] // --color-bg #fafaf9
const LUMINANCE_THRESHOLD = 128
const CELL_PX = 10
const FLICKER_OFFSET_PX = 3
export const FLICKER_MS = 300

/**
 * Draws `image` into `canvas` as a grid of square cells, one canvas pixel per
 * cell, then thresholds every pixel by luminance to accent or bg. CSS enlarges
 * the canvas with `image-rendering: pixelated`. `flicker` shifts the source
 * rectangle by a random 0 to 3 px.
 */
export function drawPixelOverlay(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  widthPx: number,
  flicker: boolean,
) {
  const cells = Math.round(widthPx / CELL_PX)
  if (canvas.width !== cells || canvas.height !== cells) {
    canvas.width = cells
    canvas.height = cells
  }
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return
  const offset = flicker ? Math.floor(Math.random() * (FLICKER_OFFSET_PX + 1)) : 0
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight) - FLICKER_OFFSET_PX
  context.imageSmoothingEnabled = false
  context.drawImage(image, offset, offset, sourceSize, sourceSize, 0, 0, cells, cells)

  const frame = context.getImageData(0, 0, cells, cells)
  const data = frame.data
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
    const [r, g, b] = luminance < LUMINANCE_THRESHOLD ? ACCENT : BG
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
    data[i + 3] = 255
  }
  context.putImageData(frame, 0, 0)
}
