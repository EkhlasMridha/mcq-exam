import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { SelectDropdown } from "./dropdown";
import { useDropdownNavEngine } from "./hooks/useDropdownNavEngine";
import { useThrottle } from "./hooks/useThrottle";
import styles from "./select.module.css";
import type {
  DropdownCloseReason,
  DropdownOptionType,
  DropdownPlacement,
  DropdownPosition,
  SelectProps,
  ValueType,
} from "./types";
import { calculateDropdownPosition } from "./utils";
import { isDom } from "components/popup/utils";
import { usePopupWatch } from "components/hooks/usePopupWatch";
import { SelectContextProvider } from "./hooks/useSelectContext";

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
  const [isRendered, setIsRendered] = useState(false);
  const openRef = useRef(false);
  const closeReason = useRef<DropdownCloseReason | null>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownContainer, setDropdownContainer] =
    useState<HTMLUListElement | null>(null);
  const [currentPlacement, setCurrentPlacement] =
    useState<DropdownPlacement>("bottom");
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

  usePopupWatch({
    onAlign: () => onAlignDropdown(),
    onScroll: () => {},
    open: isRendered,
    popup: dropdownContainer,
    target: selectRef.current,
  });

  useEffect(() => {
    if (isRendered && openRef.current && dropdownContainer) {
      toggleDropdownInternal(true);
      openRef.current = true;
    }
  }, [isRendered, dropdownContainer]);

  const setDropdownRef = (node: HTMLUListElement) => {
    if (isDom(node)) {
      setDropdownContainer(node);
      dropdownRef.current = node;
    }
  };

  const onAlignDropdown = () => {
    if (!!dropdownRef.current && !!selectRef.current) {
      const coordinates = calculateDropdownPosition({
        dropdownElm: dropdownRef.current,
        selectElm: selectRef.current,
        offset: 4,
      });

      if (!!coordinates) {
        dropdownRef.current.style.inset = `${coordinates.y}px auto auto ${coordinates.x}px`;
        dropdownRef.current.style.width = `${coordinates.dropdownWidth}px`;
        setCurrentPlacement(coordinates?.placement);
      }
    }
  };

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
        if (!isRendered) {
          setIsRendered(open);
        } else {
          toggleDropdownInternal(open);
        }
      },
      open ? openDelay : closeDelay
    );
  }

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

  const dropdownOpenKeys = ["ArrowDown"];
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
      onSelectItem(filteredOptions[focusedIndex]);
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
    console.log(item.value);
    inputRef.current?.focus();
  }

  const toggleDropdownInternal = (open: boolean) => {
    if (!dropdownRef.current) return;
    if (open) {
      dropdownRef.current.style.display = "block";
      dropdownRef.current.style.pointerEvents = "auto";
      onAlignDropdown();
    } else {
      dropdownRef.current.style.display = "none";
      dropdownRef.current.style.pointerEvents = "none";
    }
  };

  return (
    <SelectContextProvider
      value={{
        isOpen,
        placement: currentPlacement,
      }}
    >
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
        {isRendered &&
          createPortal(
            <SelectDropdown
              ref={setDropdownRef}
              options={options}
              onSelectItem={onSelectItem}
              focusIndex={focusedIndex}
              isClosing={isClosing}
              value={selectedItem}
            />,
            document.body
          )}
      </div>
    </SelectContextProvider>
  );
}
