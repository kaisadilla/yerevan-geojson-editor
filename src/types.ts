import React from "react";

export type DivProps = React.HTMLAttributes<HTMLDivElement>;
export type SpanProps = React.HTMLAttributes<HTMLSpanElement>;
export type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;
export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type Except<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Collection<T> = Record<string, T>;

export type FixedArray<T, L extends number, A extends T[] = []> =
  A['length'] extends L ? A : FixedArray<T, L, [...A, T]>;

export type ElementSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface Vec2 {
  x: number;
  y: number;
}
