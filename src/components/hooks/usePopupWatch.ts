import { useLayoutEffect } from "react";
import type { UseWatchParams } from "../popup/types";
import { collectScroller, getWindow } from "../popup/utils";

export function usePopupWatch({
  onAlign,
  onScroll,
  open,
  popup,
  target,
}: UseWatchParams) {
  useLayoutEffect(() => {
    if (open && target && popup) {
      const targetElement = target;
      const popupElement = popup;
      const targetScrollList = collectScroller(targetElement);
      const popupScrollList = collectScroller(popupElement);

      const win = getWindow(popupElement);

      const mergedList = new Set([
        win,
        ...targetScrollList,
        ...popupScrollList,
      ]);

      const notifyScroll = () => {
        onAlign();
        onScroll();
      };
      mergedList.forEach((scroller) => {
        scroller?.addEventListener("scroll", notifyScroll, { passive: true });
      });

      win?.addEventListener("resize", notifyScroll, { passive: true });

      // First time always do align
      onAlign();

      return () => {
        mergedList.forEach((scroller) => {
          scroller?.removeEventListener("scroll", notifyScroll);
          win?.removeEventListener("resize", notifyScroll);
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, target, popup]);
}
