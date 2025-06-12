import { useMemo } from 'react';
import { DropdownItem } from './types';

export function useItemNavEngine(itemList: DropdownItem[]) {
  const navigatorEngine = useMemo(() => {
    function* forwardnavigation(initIndex = 0) {
      let currentIndex = initIndex;
      while (currentIndex < itemList.length) {
        if (itemList[currentIndex]?.disabled) {
          ++currentIndex;
          if (currentIndex >= itemList.length) currentIndex = 0;
          continue;
        }
        yield currentIndex;
        currentIndex++;
        if (currentIndex >= itemList.length) currentIndex = 0;
      }
      yield -1;
    }

    function* backwordNavigation(initIndex = itemList?.length - 1) {
      let currentIndex = initIndex;
      while (currentIndex >= 0) {
        if (itemList[currentIndex]?.disabled) {
          --currentIndex;
          if (currentIndex < 0) currentIndex = itemList.length - 1;
          continue;
        }
        yield currentIndex;
        currentIndex--;
        if (currentIndex < 0) currentIndex = itemList.length - 1;
      }
      yield -1;
    }

    const forwardNavigator = forwardnavigation();
    const backwordNavigator = backwordNavigation();

    const navEngine = {
      forwardNavigator,
      backwordNavigator,
      syncForwardNavigator: function (currentIndex: number) {
        this.forwardNavigator = forwardnavigation(currentIndex);
      },
      syncBackwordNavigator: function (currentIndex: number) {
        this.backwordNavigator = backwordNavigation(currentIndex);
      },
    };

    return navEngine;
  }, [itemList]);

  return navigatorEngine;
}
