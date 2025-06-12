import { useEffect, useRef } from 'react';
import { getShadowRoot, getWindow } from '../utils';
import type { UseWindowClickParams } from '../types';

export default function useWindowClick({
  clickToHide,
  inPopupOrChild,
  mask,
  maskClosable,
  open,
  triggerClose,
  getPopupElement,
  getTargetElement,
}: UseWindowClickParams) {
  const popupPointerDownRef = useRef(false);

  // Click to hide is special action since click popup element should not hide
  useEffect(() => {
    const popupEle = getPopupElement();
    const targetEle = getTargetElement();
    if (clickToHide && popupEle && targetEle && (!mask || maskClosable)) {
      const onPointerDown = () => {
        popupPointerDownRef.current = false;
      };

      const onTriggerClose = (e: any) => {
        if (open && !inPopupOrChild(e.composedPath?.()?.[0] || e.target) && !popupPointerDownRef.current) {
          triggerClose(false);
        }
      };

      const win = getWindow(popupEle);

      win?.addEventListener('pointerdown', onPointerDown, true);
      win?.addEventListener('mousedown', onTriggerClose, true);
      win?.addEventListener('contextmenu', onTriggerClose, true);

      // shadow root
      const targetShadowRoot = getShadowRoot(targetEle);
      if (targetShadowRoot) {
        (targetShadowRoot as EventTarget)?.addEventListener('mousedown', onTriggerClose, true);
        (targetShadowRoot as EventTarget)?.addEventListener('contextmenu', onTriggerClose, true);
      }

      // Warning if target and popup not in same root
      // if (process.env.NODE_ENV !== 'production') {
      //   const targetRoot = targetEle?.getRootNode?.();
      //   const popupRoot = popupEle.getRootNode?.();

      //   warning(
      //     targetRoot === popupRoot,
      //     `trigger element and popup element should in same shadow-sm root.`,
      //   );
      // }
      const clearEvents = () => {
        win?.removeEventListener('pointerdown', onPointerDown, true);
        win?.removeEventListener('mousedown', onTriggerClose, true);
        win?.removeEventListener('contextmenu', onTriggerClose, true);

        if (targetShadowRoot) {
          targetShadowRoot.removeEventListener('mousedown', onTriggerClose, true);
          targetShadowRoot.removeEventListener('contextmenu', onTriggerClose, true);
        }
      };

      if (!open) {
        clearEvents();
      }
      return () => {
        clearEvents();
      };
    }
  }, [clickToHide, getPopupElement, getTargetElement, inPopupOrChild, open, triggerClose, mask, maskClosable]);

  function onPopupPointerDown() {
    popupPointerDownRef.current = true;
  }

  return onPopupPointerDown;
}
