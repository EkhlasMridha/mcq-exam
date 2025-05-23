import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  color?: BtnColorType;
  size?: ElementSizeType;
  variant?: BtnVariant;
  shape?: BtnShapeType;
  icon?: ReactNode;
  loading?: boolean;
}

export type BtnColorType = "primary" | "secondary" | "warn" | "error";
export type ElementSizeType = "small" | "medium" | "large";
export type BtnVariant = "solid" | "outline" | "ghost";
export type BtnShapeType = "rounded" | "capsule" | "circle" | "square";
