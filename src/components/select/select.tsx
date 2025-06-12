import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { DropdownOptions } from "./dropdown-options";
import { useDropdownNavEngine } from "./hooks/useDropdownNavEngine";
import { useThrottle } from "./hooks/useThrottle";
import styles from "./select.module.css";
import type {
  DropdownCloseReason,
  DropdownOptionType,
  DropdownPosition,
  SelectProps,
  ValueType,
} from "./types";

export function Select<T extends ValueType>({
  dropdownPortal,
  multiple,
  onAddOption,
  onChange,
  onSearch,
  options,
  placeholder = "Select ...",
  value,
  size = "medium",
  isError,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const openRef = useRef(false);
  const closeReason = useRef<DropdownCloseReason | null>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const previousKeyboardEvent = useRef<string>(null);

  const [selectedItem, setSelectedItem] = useState(value);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  let delayTimer: NodeJS.Timeout;
  const openDelay = 100;
  const closeDelay = 300;

  const inputClassNames = [
    "mq-input",
    `mq-input-${size}`,
    styles.input_container,
  ].join(" ");
  const outlineClassNames = [styles.select_container, "mq-input-outline"];
  !!isError && outlineClassNames.unshift("error");

  function isInFocus() {
    return document.activeElement === inputRef.current;
  }

  const navigatorEngine = useDropdownNavEngine(filteredOptions);

  function handleToggleDropdown(
    open: boolean = false,
    eventName: "blur" | "toggle" = "toggle"
  ) {
    clearTimeout(delayTimer);
    setIsClosing(!open);
    eventName !== "blur" && !isInFocus() && inputRef.current?.focus();
    delayTimer = setTimeout(
      () => {
        setIsOpen(open);
        openRef.current = open;
      },
      open ? openDelay : closeDelay
    );
  }
  useEffect(() => {
    const positions = calculateDropdownPosition();
    if (!positions) return;

    setDropdownPosition({ ...positions });
  }, [isOpen]);

  // useEffect(() => {
  //   const calculateAndSetPositions = () => {
  //     const positions = calculateDropdownPosition();

  //     !!positions && setDropdownPosition({ ...positions });
  //   };
  //   window.addEventListener("scroll", () => calculateAndSetPositions(), true);

  //   return () => {
  //     window.removeEventListener(
  //       "scroll",
  //       () => calculateAndSetPositions(),
  //       true
  //     );
  //   };
  // }, []);

  const calculateDropdownPosition = (): DropdownPosition | null => {
    if (!openRef.current || !selectRef.current || !dropdownRef.current)
      return null;

    const rect = selectRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const above =
      rect.bottom + dropdownRef.current?.clientHeight > viewportHeight;
    const positionY = above ? rect.top - rect.height : rect.bottom;
    console.log(dropdownRef.current.clientHeight);
    return {
      dropdownWidth: rect.width,
      posX: rect.left,
      posY: positionY,
    };
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();

    handleToggleDropdown(false, "blur");
  };

  const toggleDropdown = (event: MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleToggleDropdown(!isOpen);
  };

  // const handleAddOption = () => {
  //   if (onAddOption) {
  //     const newOption = onAddOption(searchTerm);
  //     if (newOption) {
  //       onChange(newOption);
  //       setSearchTerm("");
  //       setIsOpen(false);
  //     }
  //   }
  // };
  const dropdownOpenKeys = ["Enter", "ArrowDown"];
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (!isOpen) {
      dropdownOpenKeys.includes(e.key) && handleToggleDropdown(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (previousKeyboardEvent.current !== e.key) {
        navigatorEngine.syncDownNavigator(
          focusedIndex >= filteredOptions?.length - 1 ? 0 : focusedIndex + 1
        );
      }
      const index = navigatorEngine.downNavigator.next().value as number;
      index >= 0 && setFocusedIndex(index);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (previousKeyboardEvent.current !== e.key) {
        navigatorEngine.syncUpNavigator(
          focusedIndex <= 0 ? filteredOptions.length - 1 : focusedIndex - 1
        );
      }
      let nextIndex = navigatorEngine.upNavigator.next().value as number;
      nextIndex >= 0 && setFocusedIndex(nextIndex);
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      // onSelectItem(filteredOptions[navigableIndexes[focusedIndex]]);
      !multiple && handleToggleDropdown(false);
    } else if (e.key === "Escape") {
      handleToggleDropdown(false);
    }
    previousKeyboardEvent.current = e.key;
  };

  const throttledHandleKeyboardNav = useThrottle(handleKeyDown, 150);

  function onSelectItem(item: DropdownOptionType<T>) {
    onChange?.(item?.value);
    setSelectedItem(item.value);
    inputRef.current?.focus();
  }

  return (
    <div className={outlineClassNames.join(" ")} ref={selectRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={inputClassNames}
        onClick={toggleDropdown}
        onKeyDown={throttledHandleKeyboardNav}
        onBlur={handleBlur}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="custom-select-listbox"
        aria-autocomplete="list"
      />
      {isOpen &&
        createPortal(
          <DropdownOptions
            ref={dropdownRef}
            position={dropdownPosition}
            options={options}
            onSelectItem={onSelectItem}
            focusIndex={focusedIndex}
            isClosing={isClosing}
            value={selectedItem}
          />,
          document.body
        )}
    </div>
  );
}
