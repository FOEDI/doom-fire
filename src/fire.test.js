import test from "node:test";
import assert from "node:assert/strict";
import { createFire, spreadFire, FIRE_PALETTE } from "./fire.js";

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
