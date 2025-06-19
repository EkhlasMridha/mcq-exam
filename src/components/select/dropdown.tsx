import { mergeRefs } from "components/utils";
import {
  forwardRef,
  useEffect,
  useRef,
  type MouseEvent,
  type Ref,
} from "react";
import styles from "./select.module.css";
import type { DropdownOptionsProps, ValueType } from "./types";
import { useSelectContext } from "./hooks/useSelectContext";

const DropdownWithoutForwardRef = <T extends ValueType>(
  {
    options,
    onSelectItem,
    isClosing,
    focusIndex = -1,
    value,
  }: DropdownOptionsProps<T>,
  ref: Ref<HTMLUListElement>
) => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const mergedRef = mergeRefs(dropdownRef, ref);
  const context = useSelectContext() || {};

  const classNames = [styles.dropdown_select];
  !isClosing && classNames.push(styles.open);
  isClosing && classNames.push(styles.close);

  if (context?.placement === "bottom") {
    classNames.unshift(styles.placement_bottom);
  } else if (context?.placement === "top") {
    classNames.unshift(styles.placement_top);
  }

  useEffect(() => {
    if (focusIndex < 0) return;
    const element = dropdownRef.current?.querySelector<HTMLLIElement>(
      `[data-index="${focusIndex}"]`
    );
    element?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [focusIndex]);

  const handleItemClick = (event: MouseEvent<HTMLUListElement>) => {
    const eventTarget = event.target as HTMLLIElement;
    const value = eventTarget.getAttribute("data-value") as ValueType;
    const valueItem = options?.find((a) => a.value === value);

    !!valueItem && onSelectItem(valueItem);
  };

  return (
    <ul
      ref={mergedRef}
      className={classNames.join(" ")}
      role="listbox"
      onClick={handleItemClick}
    >
      {!!options?.length ? (
        options?.map((option, index) => (
          <li
            key={option.value}
            id={`option-${option.value}`}
            role="option"
            className={`${styles.select_item}`}
            data-value={option?.value}
            data-disabled={option?.disabled}
            data-focus={focusIndex === index}
            data-selected={value === option?.value}
            data-index={index}
          >
            {option.label}
          </li>
        ))
      ) : (
        <div className={styles.no_data}>No options found</div>
      )}
    </ul>
  );
};

export const SelectDropdown = forwardRef(DropdownWithoutForwardRef);
