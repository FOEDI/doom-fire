export const MAX_HEAT = 36;
export const MIN_FIRE_SPEED = 15;
export const MAX_FIRE_SPEED = 120;
export const DEFAULT_FIRE_SPEED = 40;
export const MAX_WIND = 3;

export const DEFAULT_PALETTE_STOPS = [
  "#000000",
  "#b40000",
  "#ff4b00",
  "#ffd000",
  "#ffffff",
];

export const PALETTE_SETTING_IDS = [
  "palette_embers",
  "palette_red",
  "palette_orange",
  "palette_yellow",
  "palette_hot",
];

export function createFirePalette(stops = DEFAULT_PALETTE_STOPS) {
  if (
    !Array.isArray(stops) ||
    stops.length < 2 ||
    stops.some((color) => typeof color !== "string" || !/^#[\da-f]{6}$/i.test(color))
  ) {
    throw new RangeError("A fire palette needs at least two six-digit hex colors");
  }

  const rgbStops = stops.map((color) => [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ]);

  return Array.from({ length: MAX_HEAT + 1 }, (_, heat) => {
    const position = (heat / MAX_HEAT) * (rgbStops.length - 1);
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.min(lowerIndex + 1, rgbStops.length - 1);
    const blend = position - lowerIndex;
    return rgbStops[lowerIndex].map((channel, index) =>
      Math.round(channel + (rgbStops[upperIndex][index] - channel) * blend),
    );
  });
}

export const FIRE_PALETTE = createFirePalette();

export function readFireSettings(settings = {}) {
  const rawSpeed = Number(settings.fire_speed?.value);
  const rawWind = Number(settings.wind?.value);
  const speedMs = Number.isFinite(rawSpeed)
    ? Math.max(MIN_FIRE_SPEED, Math.min(MAX_FIRE_SPEED, Math.round(rawSpeed)))
    : DEFAULT_FIRE_SPEED;
  const wind = Number.isFinite(rawWind)
    ? Math.max(-MAX_WIND, Math.min(MAX_WIND, Math.round(rawWind)))
    : 0;
  const paletteStops = PALETTE_SETTING_IDS.map((id, index) => {
    const color = settings[id]?.value;
    return typeof color === "string" && /^#[\da-f]{6}$/i.test(color)
      ? color
      : DEFAULT_PALETTE_STOPS[index];
  });

  return { speedMs, wind, paletteStops };
}

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

export function spreadFire(fire, width, height, random = Math.random, wind = 0) {
  assertDimensions(width, height);
  if (!(fire instanceof Uint8Array) || fire.length !== width * height) {
    throw new RangeError("Fire buffer size must match its dimensions");
  }
  const windStrength = Number.isFinite(wind)
    ? Math.max(-MAX_WIND, Math.min(MAX_WIND, Math.round(wind)))
    : 0;

  // Update from the fuel upward so each row feeds the one above it this frame.
  for (let y = height - 2; y >= 0; y -= 1) {
    for (let x = 0; x < width; x += 1) {
      const cooling = Math.floor(random() * 3);
      const turbulence = Math.floor(random() * 3) - 1;
      const sourceX = Math.max(0, Math.min(width - 1, x - windStrength + turbulence));
      const sourceHeat = fire[(y + 1) * width + sourceX];
      fire[y * width + x] = Math.max(0, sourceHeat - cooling);
    }
  }

  return fire;
}
