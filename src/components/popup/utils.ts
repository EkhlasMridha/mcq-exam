import type {
  AlignmentPosition,
  Coordinate,
  CoordinateValueType,
  GetAdjustedCoordinatesParams,
  PositionCoordinateType,
} from "./types";

export function parsePositionArrayToCoordinateOder(
  positionArr: PositionCoordinateType
) {
  const verticleCor = ["top", "center", "bottom"];
  const horizontalCor = ["left", "center", "right"];
  let coordinates: CoordinateValueType[] = [];

  for (let row = 0; row < positionArr.length; row++) {
    for (let col = 0; col < positionArr[row].length; col++) {
      let value = positionArr[row][col];
      if (value !== 0) {
        coordinates.push({
          value,
          coordinate: [row, col],
          indicator: `${verticleCor[row]}-${horizontalCor[col]}`,
        });
      }
    }
  }
  coordinates.sort((a, b) => a.value - b.value);

  const coordinateIndicators = coordinates.reduce((cur, pre) => {
    pre.indicator && cur.push(pre.indicator as AlignmentPosition);
    return cur;
  }, [] as AlignmentPosition[]);

  return coordinateIndicators;
}

export const getAdjustedCoordinates = ({
  parsedCoordinates,
  startIndex = 0,
  popupElm,
  targetElm,
  align,
  offset = 0,
}: GetAdjustedCoordinatesParams): Coordinate => {
  const doc = popupElm?.ownerDocument;
  const { clientHeight: windowHeight = 0, clientWidth: windowWidth = 0 } =
    doc.documentElement;
  const tRect = targetElm.getBoundingClientRect() || {};
  tRect.x = tRect.x ?? tRect.left;
  tRect.y = tRect.y ?? tRect.top;
  const { x = 0, y = 0, height = 0, width = 0 } = tRect;

  const { height: popupHeight = 0, width: popupWidth = 0 } =
    popupElm.getBoundingClientRect() || {};

  if (!parsedCoordinates[startIndex])
    return { y, x, alignment: parsedCoordinates[startIndex] };

  const coordinateLocation = parsedCoordinates[startIndex];

  const adjustXBounds = (x: number): number => {
    if (x < 0) return 0;
    if (x + popupWidth > windowWidth) return windowWidth - popupWidth;
    return x;
  };

  const adjustYBounds = (y: number): number => {
    if (y < 0) return 0;
    if (y + popupHeight > windowHeight) return windowHeight - popupHeight;
    return y;
  };

  const positionCheckers: Record<AlignmentPosition, () => Coordinate | null> = {
    "top-left": () => {
      if (y - popupHeight - offset < 0) return null;
      const coordinate = {
        y: y - popupHeight - offset,
        x: adjustXBounds(x - popupWidth),
      };
      if (align === "bottomMost") {
        coordinate.y += height;
      } else if (align === "rightmost") {
        coordinate.x += width;
      }
      return coordinate;
    },
    "top-center": () => {
      if (y - popupHeight - offset < 0) return null;
      return {
        y: y - popupHeight - offset,
        x: adjustXBounds(x + width / 2 - popupWidth / 2),
      };
    },
    "top-right": () => {
      if (y - popupHeight - offset < 0) return null;
      const coordinate = {
        y: y - popupHeight - offset,
        x: adjustXBounds(x + width),
      };
      if (align === "bottomMost") {
        coordinate.y += height;
      } else if (align === "leftmost") {
        coordinate.x -= width;
      }
      return coordinate;
    },
    "center-left": () => {
      if (x - popupWidth - offset < 0) return null;
      return {
        y: adjustYBounds(y + height / 2 - popupHeight / 2),
        x: x - popupWidth - offset,
      };
    },
    "center-right": () => {
      if (x + width + popupWidth + offset > windowWidth) return null;
      return {
        y: adjustYBounds(y + height / 2 - popupHeight / 2),
        x: x + width + offset,
      };
    },
    "bottom-left": () => {
      if (y + height + popupHeight + offset > windowHeight) return null;
      const coordinate = {
        y: y + height + offset,
        x: adjustXBounds(x - popupWidth),
      };
      if (align === "rightmost") {
        coordinate.x += width;
      } else if (align === "topMost") {
        coordinate.y -= height;
      }
      return coordinate;
    },
    "bottom-center": () => {
      if (y + height + popupHeight + offset > windowHeight) return null;
      return {
        y: y + height + offset,
        x: adjustXBounds(x + width / 2 - popupWidth / 2),
      };
    },
    "bottom-right": () => {
      if (y + height + popupHeight + offset > windowHeight) return null;

      const coordinate = {
        y: y + height + offset,
        x: adjustXBounds(x + width),
      };
      if (align === "leftmost") {
        coordinate.x -= width;
      } else if (align === "topMost") {
        coordinate.y -= height;
      }
      return coordinate;
    },
  };
  const adjustedCoordinates = positionCheckers[coordinateLocation]?.();
  if (!!adjustedCoordinates)
    return { ...adjustedCoordinates, alignment: coordinateLocation };

  return getAdjustedCoordinates({
    parsedCoordinates,
    startIndex: startIndex + 1,
    popupElm,
    targetElm,
    align,
    offset,
  });
};

export function getWindow(element: Element) {
  return element.ownerDocument.defaultView;
}

export function collectScroller(ele: HTMLElement) {
  const scrollerList: HTMLElement[] = [];
  let current = ele?.parentElement;

  const scrollStyle = ["hidden", "scroll", "clip", "auto"];

  while (current) {
    const {
      overflowX = "",
      overflowY = "",
      overflow = "",
    } = getWindow(current)?.getComputedStyle(current) || {};
    if ([overflowX, overflowY, overflow].some((o) => scrollStyle.includes(o))) {
      scrollerList.push(current);
    }

    current = current.parentElement;
  }

  return scrollerList;
}

function getRoot(ele: Node) {
  return ele?.getRootNode?.();
}

/**
 * Check if is in shadowRoot
 */
export function inShadow(ele: Node) {
  return getRoot(ele) instanceof ShadowRoot;
}

/**
 * Return shadowRoot if possible
 */
export function getShadowRoot(ele: Node): ShadowRoot | null {
  return inShadow(ele) ? (getRoot(ele) as ShadowRoot) : null;
}

export function isDom(ele: Node) {
  return ele instanceof HTMLElement;
}
