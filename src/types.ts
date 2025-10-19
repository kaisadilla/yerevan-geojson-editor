import React from "react";

export type DivProps = React.HTMLAttributes<HTMLDivElement>;
export type SpanProps = React.HTMLAttributes<HTMLSpanElement>;
export type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;
export type StateSetter<T> = React.SetStateAction<T>;

export type Collection<T> = Record<string, T>;
/**
 * Defines a version of a type that is recursively immutable.
 */
export type Immutable<T> =
  T extends (...args: any[]) => any
    ? T
    : T extends object
      ? { readonly [K in keyof T]: Immutable<T[K]> }
      : T;

export type FixedArray<T, L extends number, A extends T[] = []> =
  A['length'] extends L ? A : FixedArray<T, L, [...A, T]>;

export type ElementSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface Vec2 {
  x: number;
  y: number;
}

export function getStateSetterValue<T> (setter: StateSetter<T>, prev: T) {
  if (typeof setter === 'function') {
    return (setter as (prev: T) => T)(prev);
  }
  else {
    return setter;
  }
}
