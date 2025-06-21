import { Button } from "components/button";
import { FocusTrap, type FocusTrapRef } from "components/focus-trap";
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
import { PlusIcon } from "components/icons/plus-icon";

const DropdownWithoutForwardRef = <T extends ValueType>(
  {
    options,
    onSelectItem,
    isClosing,
    focusIndex = -1,
    value,
  }: DropdownOptionsProps<T>,
  ref: Ref<HTMLDivElement>
) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mergedRef = mergeRefs(dropdownRef, ref);
  const context = useSelectContext() || {};
  const trapRef = useRef<FocusTrapRef>(null);

  const classNames = [styles.dropdown_container];
  !isClosing && classNames.push(styles.open);
  isClosing && classNames.push(styles.close);

  isClosing && trapRef.current?.getTrap()?.deactivate();

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

  const handleItemClick = (value: DropdownOptionType<T>) => {
    onSelectItem(value);
  };

  const onAddItem = (event: MouseEvent<HTMLButtonElement>) => {
    context?.onAddItem?.(event);
    context?.onClose();
  };

  return (
    <FocusTrap options={{ allowOutsideClick: true }} ref={trapRef}>
      <div ref={mergedRef} className={classNames.join(" ")}>
        <div className={styles.dropdown_select}>
          <ul role="listbox">
            <button
              style={{
                pointerEvents: "none",
                width: 0,
                height: 0,
                opacity: 0,
                position: "absolute",
                top: 0,
              }}
            />
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
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleItemClick(option);
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
    </FocusTrap>
  );
};

export const SelectDropdown = forwardRef(DropdownWithoutForwardRef);
