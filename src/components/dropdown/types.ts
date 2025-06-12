import type { ReactNode } from "react";

export interface DropdownListProps {
  items: ListItem[];
  className?: string;
  itemClassName?: string;
  closeOnSelect?: boolean;
}
export interface ListItem {
  key: string;
  label: ReactNode;
  value?: string | number;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  onClickItem?: (value?: string | number) => void;
}
