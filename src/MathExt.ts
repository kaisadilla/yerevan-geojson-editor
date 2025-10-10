import type { Vec2 } from "types";

const MathExt = {
  vec2distance (a: Vec2, b: Vec2) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
};

export default MathExt;
