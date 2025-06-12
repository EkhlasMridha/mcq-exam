import type { ButtonProps } from "components/button";
import { Popup } from "components/popup";
import type { PopupRendererProps } from "components/popup/types";
import { DropdownList } from "./dropdown-list";
import { MenuTrigger } from "./menu-trigger";
import type { ListItem } from "./types";

interface MenuDropdownProps extends Omit<ButtonProps, "suffix"> {
  popupProps?: PopupRendererProps;
  items: ListItem[];
}
export function MenuDropdown({
  children,
  popupProps,
  items,
  ...restProps
}: MenuDropdownProps) {
  return (
    <Popup
      positions={[
        [0, 2, 0],
        [3, 0, 4],
        [0, 1, 0],
      ]}
      noStyle
      popupElm={<DropdownList items={items} />}
      matchTriggerWidth
      {...popupProps}
    >
      <MenuTrigger {...restProps}>{children}</MenuTrigger>
    </Popup>
  );
}
