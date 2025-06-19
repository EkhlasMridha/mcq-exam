import type { CSSProperties, MouseEventHandler, ReactElement } from "react";

export interface CoordinateValueType {
  value: number;
  coordinate: [number, number];
  indicator: string;
}

type PositionCoordinateValueType = [number, number, number];
export type PositionCoordinateType = [
  PositionCoordinateValueType,
  PositionCoordinateValueType,
  PositionCoordinateValueType
];

export interface GetAdjustedCoordinatesParams
  extends Pick<PopupRendererProps, "align"> {
  parsedCoordinates: AlignmentPosition[];
  startIndex: number;
  popupElm: HTMLElement;
  targetElm: HTMLElement;
  offset?: number;
}

export interface Coordinate {
  y?: number;
  x?: number;
  alignment?: AlignmentPosition;
}

export interface UseWatchParams {
  open: boolean;
  target: HTMLElement | null;
  popup: HTMLElement | null;
  onAlign: VoidFunction;
  onScroll: VoidFunction;
}
export interface UseTriggerActionParams {
  mobile: boolean;
  action: TriggerActionTypes;
  showAction?: TriggerActionTypes;
  hideAction?: TriggerActionTypes;
}

export interface UseWindowClickParams {
  open: boolean;
  clickToHide: boolean;
  getPopupElement: () => HTMLElement | null;
  getTargetElement: () => HTMLElement | null;
  mask: boolean;
  maskClosable: boolean;
  inPopupOrChild: (target: EventTarget) => boolean;
  triggerClose: (open: boolean) => void;
}

export type TriggerActionType = "hover" | "focus" | "click" | "contextMenu";
export type TriggerActionTypes = TriggerActionType | TriggerActionType[];

export interface PopupRendererProps {
  children: ReactElement;
  popupElm: ReactElement<PopupInjectedProps>;
  positions?: PositionCoordinateType;
  action?: TriggerActionType;
  showAction?: TriggerActionType;
  hideAction?: TriggerActionType;
  openDelay?: number;
  closeDelay?: number;
  closeOnScroll?: boolean;
  align?: "rightmost" | "leftmost" | "bottomMost" | "topMost";
  popupContainerClassName?: string;
  noStyle?: boolean;
  offset?: number;
  matchTriggerWidth?: boolean;
}

export interface PopupWrapperProps
  extends Pick<PopupRendererProps, "noStyle" | "popupElm"> {
  onPopupMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onPopupMouseLeave?: MouseEventHandler<HTMLDivElement>;
  onPointerEnter?: MouseEventHandler<HTMLDivElement>;
  className?: string;
  closePopup: () => void;
  isClosing: boolean;
  currentAlignment?: string;
  style?: CSSProperties;
}

export interface PopupInjectedProps {
  onClose: () => void;
  isClosing: boolean;
  alignment?: string;
}

export type AlignmentPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
