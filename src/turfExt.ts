import * as turf from "@turf/turf";
import type { Position } from "geojson";

const R_MAJOR = 6378137.0;
const MAX_LAT = 85.0511287798066;

// src: https://github.com/placemark/placemark/blob/ad6d328ed50eb6226ea5101d414fa6bd0dd93544/app/lib/geometry.ts#L99

/**
 * Given two points, returns the point in the middle as perceived in the
 * Mercator projection.
 * @param a A position.
 * @param b Another position.
 */
export function mercatorMidpoint (a: Position, b: Position) : Position {
  const x0 = (180 + a[0]) / 360;
  const x1 = (180 + b[0]) / 360;

  const a_1 = a[1] < -90 ? -90 : a[1] > 90 ? 90 : a[1];
  const b_1 = b[1] < -90 ? -90 : b[1] > 90 ? 90 : b[1];

  const y0 =
    (180 -
      (180 / Math.PI) *
        Math.log(Math.tan(Math.PI / 4 + (a_1 * Math.PI) / 360))) /
    360;
  const y1 =
    (180 -
      (180 / Math.PI) *
        Math.log(Math.tan(Math.PI / 4 + (b_1 * Math.PI) / 360))) /
    360;
  const xm = (x0 + x1) / 2;
  const ym = (y0 + y1) / 2;
  const y2 = 180 - ym * 360;

  return [
    xm * 360 - 180,
    (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90,
  ];
}

function toMerc ([lng, lat]: Position) : Position {
  lat = Math.max(Math.min(lat, MAX_LAT), -MAX_LAT);
  return [
    R_MAJOR * turf.degreesToRadians(lng),
    R_MAJOR * Math.log(Math.tan(Math.PI / 4 + turf.degreesToRadians(lat) / 2)),
  ];
}

function fromMerc ([x, y]: Position) : Position {
  return [
    turf.radiansToDegrees(x / R_MAJOR),
    turf.radiansToDegrees(2 * Math.atan(Math.exp(y / R_MAJOR)) - Math.PI / 2),
  ];
}
