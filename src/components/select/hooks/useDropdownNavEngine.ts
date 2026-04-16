import { useMemo } from "react";
import type { DropdownOptionType, ValueType } from "../types";

export function useDropdownNavEngine<T extends ValueType>(
  options: DropdownOptionType<T>[]
) {
  const navigatorEngine = useMemo(() => {
    function* dropdownNavigatorGenerator(initIndex = 0) {
      let currentIndex = initIndex;
      for (let i = currentIndex; i < options?.length; ++i) {
        if (options[i]?.disabled) continue;

        currentIndex = i;
        if (currentIndex > options.length - 1) {
          currentIndex = i = -1;
          yield currentIndex + 1;
        }
        if (currentIndex + 1 === options.length) {
          i = -1;
        }
        yield currentIndex;
      }
    }
    function* dropdownNavigatorDescendingGen(
      initIndex: number = options.length - 1
    ) {
      let currentIndex = initIndex;
      for (let i = currentIndex; i >= 0; --i) {
        if (options[i]?.disabled) continue;

        currentIndex = i;
        if (i === 0) {
          i = options.length;
        }
        yield currentIndex;
      }
    }
    const downNavigator = dropdownNavigatorGenerator();
    const upNavigator = dropdownNavigatorDescendingGen();

    const navEngine = {
      upNavigator: upNavigator,
      downNavigator: downNavigator,
      syncUpNavigator: function (currentIndex: number) {
        this.upNavigator = dropdownNavigatorDescendingGen(currentIndex);
      },
      syncDownNavigator: function (currentIndex: number) {
        this.downNavigator = dropdownNavigatorGenerator(currentIndex);
      },
    };

    return navEngine;
  }, [options]);

  return navigatorEngine;
}
