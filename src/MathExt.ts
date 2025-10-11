import type { Vec2 } from "types";

const MathExt = {
  vec2distance (a: Vec2, b: Vec2) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  },
  clamp (val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }
};

export default MathExt;
