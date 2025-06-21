import type {
  CalculateDropdownPositionParams,
  DropdownPlacement,
  DropdownPosition,
} from "./types";

export function getWin(ele: HTMLElement) {
  return ele.ownerDocument.defaultView;
}
export function toNum(num: number, defaultValue = 1) {
  return Number.isNaN(num) ? defaultValue : num;
}
export function getPxValue(val: string) {
  return toNum(parseFloat(val), 0);
}

export function calculateDropdownPosition({
  dropdownElm,
  selectElm,
  offset = 0,
  nextPlacementIndex = 0,
}: CalculateDropdownPositionParams): DropdownPosition | null {
  const doc = dropdownElm?.ownerDocument;
  const {
    height: targetHeight,
    width: targetWidth = 0,
    x: targetPosX = 0,
    y: targetPosY = 0,
  } = selectElm?.getBoundingClientRect() || {};
  const selectWindow = getWin(selectElm);

  const { borderTopWidth: selectBorderWidth = "" } =
    selectWindow?.getComputedStyle(selectElm) || {};
  const targetBorderOffset = Math.round(getPxValue(selectBorderWidth));

  const { clientHeight: windowHeight = 0 } = doc.documentElement || {};

  const win = getWin(dropdownElm);
  const { height: dropdownHeight = "" } =
    win?.getComputedStyle(dropdownElm) || {};

  const originalDropdownHeight = getPxValue(dropdownHeight);

  const coordinatePosition: DropdownPlacement[] = ["bottom", "top"];
  const offsetAdjustValue = targetBorderOffset + 1;
  const adjustedTargetY = targetPosY - offsetAdjustValue;

  if (nextPlacementIndex > coordinatePosition.length - 1) return null;

  const positionCalculatorEngine: Record<
    DropdownPlacement,
    () => Omit<DropdownPosition, "dropdownWidth" | "placement"> | null
  > = {
    top: () => {
      const topY =
        adjustedTargetY - originalDropdownHeight - offsetAdjustValue - offset;
      if (topY < 0) return null;
      return {
        y: topY,
        x: targetPosX,
      };
    },
    bottom: () => {
      if (
        adjustedTargetY + targetHeight + originalDropdownHeight + offset >
        windowHeight
      )
        return null;
      return {
        y: adjustedTargetY + targetHeight + offset,
        x: targetPosX,
      };
    },
  };
  const coordinates =
    positionCalculatorEngine[coordinatePosition[nextPlacementIndex]]();
  if (!coordinates)
    return calculateDropdownPosition({
      dropdownElm,
      offset,
      nextPlacementIndex: nextPlacementIndex + 1,
      selectElm,
    });

  return {
    ...coordinates,
    dropdownWidth: targetWidth,
    placement: coordinatePosition[nextPlacementIndex],
  };
}
