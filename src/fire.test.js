import test from "node:test";
import assert from "node:assert/strict";
import {
  createFire,
  spreadFire,
  FIRE_PALETTE,
  DEFAULT_PALETTE_STOPS,
  createFirePalette,
  readFireSettings,
} from "./fire.js";

test("rejects invalid field dimensions", () => {
  assert.throws(() => createFire(0, 2), RangeError);
  assert.throws(() => createFire(2, 0), RangeError);
});

test("starts with a hot fuel row and a cold area above it", () => {
  const fire = createFire(3, 2);

  assert.deepEqual([...fire], [0, 0, 0, 36, 36, 36]);
});

test("spreads heat upward with cooling and sideways drift", () => {
  const fire = createFire(3, 2);
  fire.fill(0, 3);
  fire[4] = 36;
  spreadFire(fire, 3, 2, () => 0.99);

  assert.deepEqual([...fire], [34, 0, 0, 0, 36, 0]);
});

test("keeps the source row lit and never produces negative heat", () => {
  const fire = createFire(1, 4);
  spreadFire(fire, 1, 4, () => 0.99);

  assert.deepEqual([...fire], [30, 32, 34, 36]);
  assert.ok([...fire].every((heat) => heat >= 0 && heat <= 36));
});

test("provides the classic black-to-white fire palette", () => {
  assert.equal(FIRE_PALETTE.length, 37);
  assert.deepEqual(FIRE_PALETTE[0], [0, 0, 0]);
  assert.deepEqual(FIRE_PALETTE[36], [255, 255, 255]);
});

test("interpolates the five editable palette colors across the heat range", () => {
  const palette = createFirePalette([
    "#000000",
    "#800000",
    "#ff4000",
    "#ffff00",
    "#ffffff",
  ]);

  assert.equal(palette.length, 37);
  assert.deepEqual(palette[0], [0, 0, 0]);
  assert.deepEqual(palette[9], [128, 0, 0]);
  assert.deepEqual(palette[18], [255, 64, 0]);
  assert.deepEqual(palette[27], [255, 255, 0]);
  assert.deepEqual(palette[36], [255, 255, 255]);
});

test("rejects malformed palette colors", () => {
  assert.throws(() => createFirePalette(["#000000", "red"]), RangeError);
});

test("reads speed, wind, and palette changes from DeskThing settings", () => {
  const settings = readFireSettings({
    fire_speed: { value: 75 },
    wind: { value: -2 },
    palette_embers: { value: "#010203" },
  });

  assert.equal(settings.speedMs, 75);
  assert.equal(settings.wind, -2);
  assert.deepEqual(settings.paletteStops, [
    "#010203",
    ...DEFAULT_PALETTE_STOPS.slice(1),
  ]);
});

test("clamps speed and wind to their supported ranges", () => {
  const settings = readFireSettings({
    fire_speed: { value: 999 },
    wind: { value: -99 },
  });

  assert.equal(settings.speedMs, 120);
  assert.equal(settings.wind, -3);
});

test("wind pushes the flame in the selected direction", () => {
  const rightwardFire = createFire(5, 2);
  rightwardFire.fill(0, 5);
  rightwardFire[7] = 36;
  spreadFire(rightwardFire, 5, 2, () => 0.5, 1);

  const leftwardFire = createFire(5, 2);
  leftwardFire.fill(0, 5);
  leftwardFire[7] = 36;
  spreadFire(leftwardFire, 5, 2, () => 0.5, -1);

  assert.deepEqual([...rightwardFire.slice(0, 5)], [0, 0, 0, 35, 0]);
  assert.deepEqual([...leftwardFire.slice(0, 5)], [0, 35, 0, 0, 0]);
});
