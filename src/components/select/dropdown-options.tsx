import { type MouseEvent } from "react";
import styles from "./select.module.css";
import type { DropdownOptionsProps, ValueType } from "./types";

export function DropdownOptions<T extends ValueType>({
  position,
  options,
  width,
  onSelectItem,
  isClosing,
  focusIndex,
  value,
}: DropdownOptionsProps<T>) {
  const handleItemClick = (event: MouseEvent<HTMLDivElement>) => {
    const eventTarget = event.target as HTMLDivElement;
    const value = eventTarget.getAttribute("data-value") as ValueType;
    const valueItem = options?.find((a) => a.value === value);

    !!valueItem && onSelectItem(valueItem);
  };

  const classNames = [styles.dropdown_select];
  !isClosing && classNames.push(styles.open);
  isClosing && classNames.push(styles.close);

  return (
    <div
      style={{
        inset: "auto",
      }}
      className={classNames.join(" ")}
      role="listbox"
      onClick={handleItemClick}
    >
      {!!options?.length ? (
        options?.map((option, index) => (
          <div
            key={option.value}
            id={`option-${option.value}`}
            role="option"
            className={`${styles.select_item}`}
            data-value={option?.value}
            data-disabled={option?.disabled}
            data-focus={focusIndex === index}
            data-selected={value === option?.value}
          >
            {option.label}
          </div>
        ))
      ) : (
        <div className={styles.no_data}>No options found</div>
      )}
    </div>
  );
}
