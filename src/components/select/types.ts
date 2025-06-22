import type { MouseEvent, ReactNode } from "react";
import type { ControlProps } from "types/common";

export type ValueType = string | number;
export interface DropdownOptionType<V extends ValueType> {
  label: ReactNode;
  value: V;
  disabled?: boolean;
  extra?: any;
}
export interface SelectProps<V extends ValueType> extends ControlProps {
  value?: V;
  options?: DropdownOptionType<V>[];
  multiple?: boolean;
  onChange?: (value: V) => void;
  onSearch?: (searchTerm?: string) => DropdownOptionType<V>;
  placeholder?: string;
  dropdownPortal?: HTMLElement;
  size?: "small" | "medium" | "large";
  onAddItem?: (
    e?: MouseEvent<HTMLButtonElement>
  ) => Promise<DropdownOptionType<V>>;
}

export interface DropdownOptionsProps<T extends ValueType>
  extends Pick<SelectProps<T>, "options"> {
  onSelectItem: (item: DropdownOptionType<T>) => void;
  isClosing?: boolean;
  focusIndex?: number;
  value?: ValueType;
}
export interface DropdownPosition {
  x: number;
  y: number;
  dropdownWidth: number;
  placement: DropdownPlacement;
}
export type DropdownCloseReason = "outside" | "choose" | "toogle";
export type DropdownPlacement = "top" | "bottom";
export interface CalculateDropdownPositionParams {
  dropdownElm: HTMLElement;
  selectElm: HTMLElement;
  offset?: number;
  nextPlacementIndex?: number;
}
