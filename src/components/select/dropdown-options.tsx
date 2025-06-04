import { useEffect, useRef, type MouseEvent } from "react";
import styles from "./select.module.css";
import type { DropdownOptionsProps, ValueType } from "./types";
import { ReactCoolScrollbar } from "react-cool-scrollbar";

export function DropdownOptions<T extends ValueType>({
  position,
  options,
  width,
  onSelectItem,
  isClosing,
  focusIndex = -1,
  value,
}: DropdownOptionsProps<T>) {
  const dropdownRef = useRef<HTMLUListElement>(null);

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

  const classNames = [styles.dropdown_select];
  !isClosing && classNames.push(styles.open);
  isClosing && classNames.push(styles.close);

  return (
    <ul
      ref={dropdownRef}
      style={{
        inset: "auto",
      }}
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
}
