import { isMobile } from "components/utils";
import {
  Children,
  cloneElement,
  type MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { DEFAULT_POSITIONS } from "./const";
import { PopupRendererContext } from "./hooks/usePopupContext";
import { usePopupWatch } from "components/hooks/usePopupWatch";
import { useTriggerAction } from "./hooks/useTriggerAction";
import useWindowClick from "./hooks/useWindowClick";
import { PopupWrapper } from "./popup-wrapper";
import type { AlignmentPosition, PopupRendererProps } from "./types";
import {
  getAdjustedCoordinates,
  getShadowRoot,
  isDom,
  parsePositionArrayToCoordinateOder,
} from "./utils";

export const Popup = ({
  children,
  popupElm,
  positions = DEFAULT_POSITIONS,
  action = "click",
  showAction,
  hideAction,
  openDelay = 0.1,
  closeDelay = 0.1,
  closeOnScroll,
  align,
  popupContainerClassName,
  noStyle,
  offset = 0,
  matchTriggerWidth,
}: PopupRendererProps) => {
  const childRef = useRef<HTMLElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const delayRef = useRef<NodeJS.Timeout>(null);
  const openRef = useRef(false);
  const popupInit = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentAlignment, setCurrentAlignment] = useState<AlignmentPosition>();
  const [popupContainer, setPopupContainer] = useState<HTMLDivElement | null>(
    null
  );

  const parsedCoordinates = parsePositionArrayToCoordinateOder(positions);

  const setPopupRef = (node: HTMLDivElement) => {
    if (isDom(node)) {
      setPopupContainer(node);
      popupRef.current = node;
    }
  };

  // =========================== Mobile ===========================
  const [mobile, setMobile] = useState(false);
  useLayoutEffect(() => {
    setMobile(isMobile());
  }, []);
  //===============================================================

  const onScroll = () => {
    if (isRendered && clickToHide && closeOnScroll) {
      triggerPopup(false);
    }
  };

  useEffect(() => clearDelay, []);

  usePopupWatch({
    onAlign: () => onAlignPopup(),
    onScroll: onScroll,
    open: isRendered,
    popup: popupContainer,
    target: childRef.current,
  });

  const [showActions, hideActions] = useTriggerAction({
    action,
    mobile,
    hideAction,
    showAction,
  });
  const clickToShow = showActions.has("click");
  const clickToHide =
    hideActions.has("click") || hideActions.has("contextMenu");

  // ========================== Children ==========================
  const child = Children.only(children) as React.ReactElement;
  const originChildProps: any = child?.props || {};
  const cloneProps: any = {};

  const inPopupOrChild = (ele: EventTarget) => {
    const childDOM = childRef.current;

    return (
      childDOM?.contains(ele as HTMLElement) ||
      getShadowRoot(childDOM!)?.host === ele ||
      ele === childDOM ||
      popupRef.current?.contains(ele as HTMLElement) ||
      getShadowRoot(popupRef.current!)?.host === ele ||
      ele === popupRef.current
    );
  };
  useWindowClick({
    clickToHide: true,
    inPopupOrChild,
    mask: true,
    maskClosable: true,
    open: isOpen,
    getPopupElement: () => popupRef.current || null,
    getTargetElement: () => childRef.current,
    triggerClose: () => {
      !!openRef.current && triggerPopup(false, closeDelay);
    },
  });

  useEffect(() => {
    if (isRendered && openRef.current && !popupInit.current) {
      internalPopupToggle(true);
      popupInit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRendered]);

  const onAlignPopup = () => {
    if (!!childRef.current && !!popupRef.current) {
      const { x, y, alignment } = getAdjustedCoordinates({
        parsedCoordinates: parsedCoordinates,
        startIndex: 0,
        popupElm: popupRef.current,
        targetElm: childRef.current,
        align,
        offset,
      });

      setCurrentAlignment(alignment);
      popupRef.current.style.inset = `${y}px auto auto ${x}px`;
    }
  };

  function wrapperAction<Event extends React.SyntheticEvent>(
    eventName: any,
    nextOpen: boolean,
    delay?: number,
    preEvent?: (event: Event) => void
  ) {
    cloneProps[eventName] = (event: any, ...args: any[]) => {
      preEvent?.(event);
      triggerPopup(nextOpen, delay);
      // Pass to origin
      originChildProps[eventName]?.(event, ...args);
    };
  }

  // ======================= Action: Click ========================
  if (clickToShow || clickToHide) {
    cloneProps.onClick = (
      event: React.MouseEvent<HTMLElement>,
      ...args: any[]
    ) => {
      if (clickToShow && !openRef.current) {
        triggerPopup(true, openDelay);
      } else {
        openRef.current && triggerPopup(false, closeDelay);
      }
      originChildProps.onClick?.(event, ...args);
    };
  }

  // ======================= Action: Hover ========================
  const hoverToShow = showActions.has("hover");
  const hoverToHide = hideActions.has("hover");

  let onPopupMouseEnter: MouseEventHandler<HTMLDivElement> = () => {};
  let onPopupMouseLeave: VoidFunction = () => {};

  if (hoverToShow) {
    // Compatible with old browser which not support pointer event
    wrapperAction<React.MouseEvent>("onMouseEnter", true, openDelay, () => {});
    wrapperAction<React.PointerEvent>(
      "onPointerEnter",
      true,
      openDelay,
      () => {}
    );
    onPopupMouseEnter = (event) => {
      // Only trigger re-open when popup is visible
      if (
        popupRef.current?.contains(event.target as HTMLElement) &&
        isRendered
      ) {
        triggerPopup(true);
      }
    };
  }

  if (hoverToHide) {
    wrapperAction("onMouseLeave", false, closeDelay);
    wrapperAction("onPointerLeave", false, closeDelay);
    onPopupMouseLeave = () => {
      triggerPopup(false, closeDelay);
    };
  }

  // ======================= Action: Focus ========================
  if (showActions.has("focus")) {
    wrapperAction("onFocus", true, openDelay);
  }

  if (hideActions.has("focus")) {
    wrapperAction("onBlur", false, closeDelay);
  }

  // ==================== Action: ContextMenu =====================
  if (showActions.has("contextMenu")) {
    cloneProps.onContextMenu = (event: React.MouseEvent) => {
      if (hideActions.has("contextMenu")) {
        triggerPopup(!isOpen, openDelay);
      }
      event.preventDefault();
    };
  }

  // =========================== Render ===========================
  const mergedChildrenProps = {
    ...originChildProps,
    ...cloneProps,
  };

  // Child Node
  const triggerNode = cloneElement(child, {
    ref: childRef,
    ...mergedChildrenProps,
  });

  const clearDelay = () => {
    !!delayRef.current && clearTimeout(delayRef.current);
  };

  const triggerPopup = (open: boolean, delay: number = 0) => {
    clearDelay();

    setIsClosing(!open);

    if (delay === 0) {
      popUpToggle(open);
    } else {
      delayRef.current = setTimeout(() => {
        popUpToggle(open);
      }, delay * 1000);
    }
  };

  const popUpToggle = (open: boolean) => {
    if (open === openRef.current) return;

    openRef.current = open;
    setIsOpen(open);
    if (!isRendered) {
      setIsRendered(open);
    } else {
      internalPopupToggle(open);
    }
  };

  const internalPopupToggle = (open: boolean) => {
    if (!open) {
      popupRef.current!.style.display = "none";
      popupRef.current!.style.pointerEvents = "none";
    } else {
      popupRef.current!.style.pointerEvents = "auto";
      popupRef.current!.style.display = "block";
    }
    open && onAlignPopup();
  };

  return (
    <PopupRendererContext.Provider
      value={{ alignment: currentAlignment, isOpen }}
    >
      {triggerNode}
      {isRendered &&
        createPortal(
          <PopupWrapper
            onPointerEnter={onPopupMouseEnter}
            onPopupMouseEnter={onPopupMouseEnter}
            onPopupMouseLeave={onPopupMouseLeave}
            popupElm={popupElm}
            ref={setPopupRef}
            closePopup={() => triggerPopup(false)}
            className={popupContainerClassName}
            noStyle={noStyle}
            isClosing={isClosing}
            currentAlignment={currentAlignment}
            style={{
              width: matchTriggerWidth
                ? childRef.current?.getBoundingClientRect().width
                : "auto",
            }}
          />,
          document.body
        )}
    </PopupRendererContext.Provider>
  );
};
