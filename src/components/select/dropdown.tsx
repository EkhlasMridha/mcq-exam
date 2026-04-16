import { Button } from "components/button";
import { PlusIcon } from "components/icons/plus-icon";
import { mergeRefs } from "components/utils";
import {
  forwardRef,
  useEffect,
  useRef,
  type MouseEvent,
  type Ref,
} from "react";
import { useSelectContext } from "./hooks/useSelectContext";
import styles from "./select.module.css";
import type {
  DropdownOptionsProps,
  DropdownOptionType,
  ValueType,
} from "./types";

const DropdownWithoutForwardRef = <T extends ValueType>(
  {
    options,
    onSelectItem,
    isClosing,
    focusIndex = -1,
    value,
    onRessetFocusIndex,
  }: DropdownOptionsProps<T>,
  ref: Ref<HTMLDivElement>
) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mergedRef = mergeRefs(dropdownRef, ref);
  const context = useSelectContext() || {};

  const classNames = [styles.dropdown_container];
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

  const handleItemClick = (option: DropdownOptionType<T>) => {
    if (option?.disabled) return;
    onSelectItem(option);
  };

  const onAddItem = (event: MouseEvent<HTMLButtonElement>) => {
    context?.onAddItem?.(event);
    context?.onClose();
  };

  return (
    <div ref={mergedRef} className={classNames.join(" ")}>
      <div className={styles.dropdown_select}>
        <ul role="listbox">
          {!!options?.length ? (
            options?.map((option, index) => (
              <li
                key={option.value}
                title={option?.tooltip}
                id={`option-${option.value}`}
                role="option"
                aria-disabled={option?.disabled}
                className={`${styles.select_item}`}
                data-value={option?.value}
                data-disabled={option?.disabled}
                data-focus={focusIndex === index}
                data-selected={value === option?.value}
                data-index={index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleItemClick(option);
                }}
                onMouseMove={() => {
                  focusIndex >= 0 && onRessetFocusIndex();
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <div className={styles.no_data}>No options found</div>
          )}
        </ul>
      </div>
      {!!context?.onAddItem && (
        <div className={styles.dropdown_addon}>
          <Button
            variant="ghost"
            className="w-full"
            icon={<PlusIcon style={{ height: 14, width: 14 }} />}
            onClick={onAddItem}
          >
            Add new
          </Button>
        </div>
      )}
    </div>
  );
};

export const SelectDropdown = forwardRef(DropdownWithoutForwardRef);
