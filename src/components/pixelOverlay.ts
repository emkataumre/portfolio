// Two-colour pixel overlay for the Cursor Avatar. Tokens from src/index.css.
const ACCENT = [22, 163, 74] // --color-accent #16a34a
const BG = [250, 250, 249] // --color-bg #fafaf9
const THRESHOLD = 128
export const CELL_PX = 10
export const FLICKER_MS = 300
export const FLICKER_OFFSET_PX = 3

/**
 * Draws `image` into `canvas` at `cells` by `cells` pixels, then thresholds
 * every pixel by luminance to accent or bg. The canvas scales up in CSS with
 * `image-rendering: pixelated`. `offset` shifts the source rectangle for flicker.
 */
export function drawPixelOverlay(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  cells: number,
  offset: number,
) {
  if (canvas.width !== cells || canvas.height !== cells) {
    canvas.width = cells
    canvas.height = cells
  }
  const context = canvas.getContext('2d')
  if (!context) return
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight) - FLICKER_OFFSET_PX
  context.imageSmoothingEnabled = false
  context.drawImage(image, offset, offset, sourceSize, sourceSize, 0, 0, cells, cells)

  const frame = context.getImageData(0, 0, cells, cells)
  const data = frame.data
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
    const [r, g, b] = luminance < THRESHOLD ? ACCENT : BG
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
    data[i + 3] = 255
  }
  context.putImageData(frame, 0, 0)
}
