import { useMemo } from 'react';
import type { TriggerActionType, UseTriggerActionParams } from '../types';

function toArray<T>(val?: T | T[]) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}

export function useTriggerAction({
  action,
  mobile,
  hideAction,
  showAction,
}: UseTriggerActionParams): [showAction: Set<TriggerActionType>, hideAction: Set<TriggerActionType>] {
  return useMemo(() => {
    const mergedShowAction = toArray(showAction ?? action);
    const mergedHideAction = toArray(hideAction ?? action);

    const showActionSet = new Set(mergedShowAction);
    const hideActionSet = new Set(mergedHideAction);

    if (mobile) {
      if (showActionSet.has('hover')) {
        showActionSet.delete('hover');
        showActionSet.add('click');
      }

      if (hideActionSet.has('hover')) {
        hideActionSet.delete('hover');
        hideActionSet.add('click');
      }
    }

    return [showActionSet, hideActionSet];
  }, [mobile, action, showAction, hideAction]);
}
