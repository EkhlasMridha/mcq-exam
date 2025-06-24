import { usePopupWatch } from "components/hooks/usePopupWatch";
import { isDom } from "components/popup/utils";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { SelectDropdown } from "./dropdown";
import { useDropdownNavEngine } from "./hooks/useDropdownNavEngine";
import { SelectContextProvider } from "./hooks/useSelectContext";
import { useThrottle } from "./hooks/useThrottle";
import { SelectPlaceHolder } from "./select-placeholder";
import { SingleValueItem } from "./singlevalue-item";
import type {
  DropdownOptionType,
  DropdownPlacement,
  SelectProps,
  ValueType,
} from "./types";
import { calculateDropdownPosition } from "./utils";
import { ValueContainer } from "./value-container";

export function Select<T extends ValueType>({
  dropdownPortal,
  multiple,
  onChange,
  onSearch,
  options,
  placeholder = "Select ...",
  value,
  size = "medium",
  isError,
  onAddItem,
  closeDelay = 400,
  openDelay = 100,
  disabled,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownContainer, setDropdownContainer] =
    useState<HTMLDivElement | null>(null);
  const [currentPlacement, setCurrentPlacement] =
    useState<DropdownPlacement>("bottom");
  const [selectContainer, setSelectContainer] = useState<HTMLDivElement | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<T | null>(value || null);
  const [searchValue, setSearchValue] = useState<string>();

  const dropdownInternalRendered = useRef<boolean>(false);
  const previousKeyboardEvent = useRef<string>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  let delayTimer: NodeJS.Timeout;
  let animationStartDelay: NodeJS.Timeout;

  const inputClassNames = [
    "mq-input",
    `mq-input-${size}`,
    "input-container",
  ].join(" ");
  const containerClassNames = ["select-container", "mq-input-outline"];
  disabled && containerClassNames.unshift("select-disabled");
  !!isError && containerClassNames.unshift("error");
  isOpen && containerClassNames.push("select-open");

  const setSelectRef = (node: HTMLDivElement) => {
    if (isDom(node)) {
      setSelectContainer(node);
      selectRef.current = node;
    }
  };

  function isInFocus() {
    return document.activeElement === inputRef.current;
  }

  const navigatorEngine = useDropdownNavEngine(filteredOptions);

  usePopupWatch({
    onAlign: () => onAlignDropdown(),
    onScroll: () => {},
    open: isRendered,
    popup: dropdownContainer,
    target: selectContainer,
  });

  useEffect(() => {
    if (isRendered && !dropdownInternalRendered.current && dropdownContainer) {
      toggleDropdownInternal(true);
      dropdownInternalRendered.current = true;
    }
  }, [isRendered, dropdownContainer]);

  const selectedOption = useMemo(() => {
    return options?.find((a) => a.value === selectedItem);
  }, [selectedItem, options]);

  const setDropdownRef = (node: HTMLDivElement) => {
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

  function handleToggleDropdown(open: boolean = false) {
    if (isOpen === open) return;
    clearTimeout(delayTimer);
    clearTimeout(animationStartDelay);

    if (open) {
      setIsClosing(false);
    } else {
      animationStartDelay = setTimeout(() => {
        setIsClosing(true);
      }, closeDelay / 3);
    }

    !isInFocus() && !isOpen && inputRef.current?.focus();
    delayTimer = setTimeout(
      async () => {
        setIsOpen(open);

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

    requestAnimationFrame(() => {
      const activeElm = document.activeElement;
      const isActiveSelect = selectContainer?.contains(activeElm);
      const isActiveDropdown = dropdownContainer?.contains(activeElm);

      if (!!activeElm && !isActiveDropdown && !isActiveSelect) {
        handleToggleDropdown(false);
      }
    });
  };

  const dropdownOpenKeys = ["ArrowDown"];
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === "Backspace") {
      setSelectedItem(null);
      return;
    }

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

  const resetAllActivity = () => {
    !!searchValue && setSearchValue("");
    if (options !== filteredOptions) {
      setFilteredOptions(options || []);
    }
  };
  async function onSelectItem(item: DropdownOptionType<T>) {
    onChange?.(item?.value);
    await setSelectedItem(item.value);

    !multiple && handleToggleDropdown(false);
  }

  const toggleDropdownInternal = (open: boolean) => {
    if (!dropdownRef.current) return;
    if (open) {
      dropdownRef.current.style.display = "flex";
      dropdownRef.current.style.pointerEvents = "auto";
      onAlignDropdown();
    } else {
      dropdownRef.current.style.display = "none";
      dropdownRef.current.style.pointerEvents = "none";
      resetAllActivity();
    }
  };

  const onAddDropdownItem = async (event?: MouseEvent<HTMLButtonElement>) => {
    const result = await onAddItem?.(event);
    if (!!result) {
      setSelectedItem(result?.value);
      setFilteredOptions((pre) => [...pre, result]);
    }
  };

  const onResetFocusIndex = () => {
    setFocusedIndex(-1);
  };

  const onSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target?.value;
    setSearchValue(value ?? "");
    const searchedItems = options?.filter((a) =>
      a.label?.toLowerCase()?.includes(value?.toLowerCase())
    );
    setFilteredOptions(searchedItems || []);
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (event.target !== inputRef.current) {
      event.preventDefault();
    }

    if (!isOpen) {
      handleToggleDropdown(true);
    }
  };

  const canShowValue = !!selectedItem && !searchValue;

  return (
    <SelectContextProvider
      value={{
        isOpen,
        placement: currentPlacement,
        onAddItem: onAddDropdownItem,
        onClose: () => handleToggleDropdown(false),
        disabled,
      }}
    >
      <div
        className={containerClassNames.join(" ")}
        ref={setSelectRef}
        onMouseDown={handleMouseDown}
      >
        <input
          ref={inputRef}
          type="text"
          className={inputClassNames}
          onKeyDown={throttledHandleKeyboardNav}
          onBlur={handleBlur}
          onChange={onSearchValue}
          value={searchValue}
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls="custom-select-listbox"
          aria-autocomplete="list"
        />
        {!selectedItem && (
          <SelectPlaceHolder
            placeHolder={placeholder}
            style={{ visibility: !!searchValue ? "hidden" : "visible" }}
          />
        )}
        {canShowValue && (
          <ValueContainer multiple={multiple}>
            <SingleValueItem tooltip={selectedOption?.tooltip}>
              {selectedOption?.label}
            </SingleValueItem>
          </ValueContainer>
        )}
        {isRendered &&
          createPortal(
            <SelectDropdown
              ref={setDropdownRef}
              options={filteredOptions}
              onSelectItem={onSelectItem}
              onRessetFocusIndex={onResetFocusIndex}
              focusIndex={focusedIndex}
              isClosing={isClosing}
              value={selectedItem}
            />,
            dropdownPortal ?? document.body
          )}
      </div>
    </SelectContextProvider>
  );
}
