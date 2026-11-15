export const MAX_HEAT = 36;

export const FIRE_PALETTE = Array.from({ length: MAX_HEAT + 1 }, (_, heat) => {
  if (heat === 0) return [0, 0, 0];
  if (heat <= 11) return [Math.round((heat / 11) * 255), 0, 0];
  if (heat <= 23) return [255, Math.round(((heat - 12) / 11) * 165), 0];
  if (heat <= 31) return [255, 165 + Math.round(((heat - 24) / 7) * 90), 0];
  return [255, 255, Math.round(((heat - 32) / 4) * 255)];
});

function assertDimensions(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    throw new RangeError("Fire dimensions must be positive integers");
  }
}

export function createFire(width, height) {
  assertDimensions(width, height);
  const fire = new Uint8Array(width * height);
  fire.fill(MAX_HEAT, (height - 1) * width);
  return fire;
}

export function spreadFire(fire, width, height, random = Math.random) {
  assertDimensions(width, height);
  if (!(fire instanceof Uint8Array) || fire.length !== width * height) {
    throw new RangeError("Fire buffer size must match its dimensions");
  }

  // Update from the fuel upward so each row feeds the one above it this frame.
  for (let y = height - 2; y >= 0; y -= 1) {
    for (let x = 0; x < width; x += 1) {
      const cooling = Math.floor(random() * 3);
      const drift = Math.floor(random() * 3) - 1;
      const sourceX = Math.max(0, Math.min(width - 1, x + drift));
      const sourceHeat = fire[(y + 1) * width + sourceX];
      fire[y * width + x] = Math.max(0, sourceHeat - cooling);
    }
  }

  return fire;
}
