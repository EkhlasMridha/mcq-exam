import { type PopupInjectedProps, usePopupContext } from "components/popup";
import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./dropdown.module.css";
import type { DropdownListProps } from "./types";
import { useItemNavEngine } from "./useItemNavEngine";

type InternalDropdownListProps = DropdownListProps & PopupInjectedProps;
export const DropdownList = (props: DropdownListProps) => {
  const {
    items,
    onClose = () => {},
    className,
    itemClassName,
    closeOnSelect = true,
    alignment,
  } = props as InternalDropdownListProps;
  const classNames = [styles.dropdown_menu, className];
  const itemClassNames = [styles.dropdown_item, itemClassName]
    .filter(Boolean)
    .join(" ");
  const listRef = useRef<HTMLUListElement>(null);
  const popupContext = usePopupContext();
  const lastNavEventKey = useRef<string | null>(null);
  const focusInputRef = useRef<HTMLInputElement>(null);

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const focusedIndexRef = useRef(focusedIndex);

  const navEngine = useItemNavEngine(items);

  const anchorPointMap = new Map<string, string>([
    ["top", styles.anchor_bottom],
    ["bottom", styles.anchor_top],
    ["center", styles.anchor_center],
  ]);
  const locationPoint = alignment?.split("-")?.[0] || "center";
  classNames.unshift(anchorPointMap.get(locationPoint));

  useEffect(() => {
    const item =
      listRef.current?.querySelector<HTMLLIElement>(`[data-focus="true"]`);
    item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusedIndex]);

  const onSelectItem = (event: MouseEvent<HTMLUListElement>) => {
    event.stopPropagation();
    if (event.target instanceof HTMLLIElement && closeOnSelect) {
      onClose();
    }
  };

  const handleKeyboardNavigation = (event: KeyboardEvent) => {
    if (!popupContext.isOpen) return;
    event.stopPropagation();
    event.preventDefault();

    if (event.key === "Escape" || event.key === "Tab") {
      onClose();
    } else if (event.key === "Enter") {
      const item =
        listRef.current?.querySelector<HTMLLIElement>(`[data-focus="true"]`);
      item?.click();
    } else if (event.key === "ArrowDown") {
      if (lastNavEventKey.current !== event.key) {
        navEngine.syncForwardNavigator(
          focusedIndexRef.current >= items?.length - 1
            ? 0
            : focusedIndexRef.current + 1
        );
      }
      const index = navEngine.forwardNavigator.next().value as number;
      index >= 0 && setItemAsFocused(index);
    } else if (event.key === "ArrowUp") {
      if (lastNavEventKey.current !== event.key) {
        navEngine.syncBackwordNavigator(
          focusedIndexRef.current <= 0
            ? items?.length - 1
            : focusedIndexRef.current - 1
        );
      }
      const index = navEngine.backwordNavigator.next().value as number;
      index >= 0 && setItemAsFocused(index);
    }

    lastNavEventKey.current = event.key;
  };

  function setItemAsFocused(index: number) {
    setFocusedIndex(index);
    focusedIndexRef.current = index;
  }

  useEffect(() => {
    if (!popupContext.isOpen) {
      setItemAsFocused(-1);
      return;
    }
    setTimeout(() => {
      focusInputRef.current?.focus();
    }, 0);
  }, [popupContext.isOpen]);

  return (
    <ul
      ref={listRef}
      onClick={onSelectItem}
      className={classNames.filter(Boolean).join(" ")}
      role="dropdown-listbox"
    >
      <input
        style={{ position: "absolute", left: -9999999, width: 10 }}
        onKeyDown={handleKeyboardNavigation}
        ref={focusInputRef}
        tabIndex={-1}
      />
      {items?.map((item, index) => {
        const classNamesList = [itemClassNames, item.className];
        item?.disabled && classNamesList.push(styles.disabled);
        return (
          <li
            key={item.key}
            className={classNamesList.join(" ")}
            onClick={() => item.onClickItem?.(item.value)}
            data-index={index}
            data-focus={focusedIndex === index}
            tabIndex={-1}
          >
            {item?.icon}
            {item.label}
          </li>
        );
      })}
    </ul>
  );
};
