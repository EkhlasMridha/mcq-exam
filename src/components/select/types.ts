import type { ReactNode } from "react";
import type { ControlProps } from "types/common";

export interface OnAddOptionParams<V extends ValueType> {
  onSuccess?: (newOption: V) => void;
}
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
  onAddOption?: (params: OnAddOptionParams<V>) => void;
  onSearch?: (searchTerm?: string) => DropdownOptionType<V>;
  placeholder?: string;
  dropdownPortal?: HTMLElement;
  size?: "small" | "medium" | "large";
}

export interface DropdownOptionsProps<T extends ValueType>
  extends Pick<SelectProps<T>, "options"> {
  position?: DropdownPosition;
  onSelectItem: (item: DropdownOptionType<T>) => void;
  isClosing?: boolean;
  focusIndex?: number;
  value?: ValueType;
}
export interface DropdownPosition {
  posX: number;
  posY: number;
  dropdownWidth: number;
}
export type DropdownCloseReason = "outside" | "choose" | "toogle";
