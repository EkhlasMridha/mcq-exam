import React, { type ReactElement } from "react";
import {
  createFocusTrap,
  type FocusTrap as Trap,
  type Options as FocusTrapOptions,
} from "focus-trap";
import { isFocusable } from "tabbable";
import type { FocusTrapProps, Maybe } from "./types";

export class FocusTrap extends React.Component<FocusTrapProps> {
  static defaultProps = {
    active: true,
    paused: false,
    focusTrapOptions: {},
    _createFocusTrap: createFocusTrap,
  };

  previouslyFocusedElement: Maybe<Element> = null;
  outsideClick: Maybe<{ target: EventTarget; allowDeactivation: boolean }> =
    null;
  focusTrap: Maybe<Trap> = null;
  focusTrapElements: (HTMLElement | SVGElement)[];

  internalOptions: FocusTrapOptions;
  originalOptions: FocusTrapOptions;

  constructor(props: FocusTrapProps) {
    super(props);

    this.handleDeactivate = this.handleDeactivate.bind(this);
    this.handlePostDeactivate = this.handlePostDeactivate.bind(this);
    this.handleClickOutsideDeactivates =
      this.handleClickOutsideDeactivates.bind(this);

    this.originalOptions = {
      returnFocusOnDeactivate: true,
      clickOutsideDeactivates: false,
      ...props.focusTrapOptions,
    };

    this.internalOptions = {
      ...props.focusTrapOptions,
      returnFocusOnDeactivate: false,
      onDeactivate: this.handleDeactivate,
      onPostDeactivate: this.handlePostDeactivate,
      clickOutsideDeactivates: this.handleClickOutsideDeactivates,
    };

    this.focusTrapElements = props.containerElements || [];
    this.updatePreviousElement();
  }

  getDocument(): Document | undefined {
    return (
      this.props.focusTrapOptions?.document ||
      (typeof document !== "undefined" ? document : undefined)
    );
  }

  getNodeForOption(
    optionName: keyof FocusTrapOptions,
    ...params: any[]
  ): Maybe<HTMLElement | SVGElement | false> {
    const optionRaw =
      this.internalOptions[optionName] ?? this.originalOptions[optionName];

    let optionValue: any;
    if (typeof optionRaw === "function") {
      try {
        optionValue = (optionRaw as (...args: any[]) => unknown)(...params);
      } catch {
        throw new Error(`Error calling function for option \`${optionName}\``);
      }
    } else {
      optionValue = optionRaw;
    }

    if (optionValue === true) return undefined;
    if (!optionValue) return optionValue;

    if (typeof optionValue === "string") {
      const node = this.getDocument()?.querySelector(optionValue);
      if (!node) {
        throw new Error(
          `\`${optionName}\` as selector refers to no known node`
        );
      }
      return node as HTMLElement | SVGElement;
    }

    if (
      optionValue instanceof HTMLElement ||
      optionValue instanceof SVGElement
    ) {
      return optionValue;
    }

    throw new Error(
      `\`${optionName}\` was specified but was not a valid node or selector`
    );
  }

  getReturnFocusNode(): Maybe<Element | false> {
    const node = this.getNodeForOption(
      "setReturnFocus",
      this.previouslyFocusedElement
    );
    return node ?? this.previouslyFocusedElement;
  }

  updatePreviousElement() {
    const currentDocument = this.getDocument();
    if (currentDocument) {
      this.previouslyFocusedElement = currentDocument.activeElement;
    }
  }

  deactivateTrap() {
    if (!this.focusTrap || !this.focusTrap.active) return;

    this.focusTrap.deactivate({
      returnFocus: false,
      onDeactivate: this.originalOptions.onDeactivate ?? undefined,
    });
  }

  handleClickOutsideDeactivates(event: MouseEvent | TouchEvent): boolean {
    const allowDeactivation =
      typeof this.originalOptions.clickOutsideDeactivates === "function"
        ? this.originalOptions.clickOutsideDeactivates(event)
        : this.originalOptions.clickOutsideDeactivates;

    if (allowDeactivation) {
      this.outsideClick = {
        target: event.target!,
        allowDeactivation,
      };
    }

    return allowDeactivation ?? false;
  }

  handleDeactivate() {
    this.originalOptions.onDeactivate?.();
    this.deactivateTrap();
  }

  handlePostDeactivate() {
    const finishDeactivation = () => {
      const returnFocusNode = this.getReturnFocusNode();
      const canReturnFocus = !!(
        this.originalOptions.returnFocusOnDeactivate &&
        returnFocusNode instanceof HTMLElement &&
        (!this.outsideClick ||
          (this.outsideClick.allowDeactivation &&
            !isFocusable(
              this.outsideClick.target as Element,
              this.internalOptions.tabbableOptions
            )))
      );

      const { preventScroll = false } = this.internalOptions;
      if (canReturnFocus && returnFocusNode instanceof HTMLElement) {
        returnFocusNode.focus({ preventScroll });
      }

      this.originalOptions.onPostDeactivate?.();
      this.outsideClick = null;
    };

    if (this.originalOptions.checkCanReturnFocus) {
      const node = this.getReturnFocusNode();
      if (!!node) {
        this.originalOptions
          .checkCanReturnFocus(node as HTMLElement)
          .then(finishDeactivation, finishDeactivation);
      } else {
        finishDeactivation();
      }
    } else {
      finishDeactivation();
    }
  }

  setupFocusTrap() {
    if (this.focusTrap) {
      if (this.props.active && !this.focusTrap.active) {
        this.focusTrap.activate();
        if (this.props.paused) this.focusTrap.pause();
      }
    } else {
      if (this.focusTrapElements.some(Boolean)) {
        this.focusTrap = (this.props._createFocusTrap ?? createFocusTrap)(
          this.focusTrapElements,
          this.internalOptions
        );

        if (this.props.active) this.focusTrap.activate();
        if (this.props.paused) this.focusTrap.pause();
      }
    }
  }

  componentDidMount() {
    if (this.props.active) {
      this.setupFocusTrap();
    }
  }

  componentDidUpdate(prevProps: FocusTrapProps) {
    if (this.focusTrap) {
      if (prevProps.containerElements !== this.props.containerElements) {
        this.focusTrap.updateContainerElements?.(this.props.containerElements!);
      }

      const hasActivated = !prevProps.active && this.props.active;
      const hasDeactivated = prevProps.active && !this.props.active;
      const hasPaused = !prevProps.paused && this.props.paused;
      const hasUnpaused = prevProps.paused && !this.props.paused;

      if (hasActivated) {
        this.updatePreviousElement();
        this.focusTrap.activate();
      }

      if (hasDeactivated) {
        this.deactivateTrap();
        return;
      }

      if (hasPaused) {
        this.focusTrap.pause();
      }

      if (hasUnpaused) {
        this.focusTrap.unpause();
      }
    } else {
      if (prevProps.containerElements !== this.props.containerElements) {
        this.focusTrapElements = this.props.containerElements || [];
      }

      if (this.props.active) {
        this.updatePreviousElement();
        this.setupFocusTrap();
      }
    }
  }

  componentWillUnmount() {
    this.deactivateTrap();
  }

  render(): React.ReactNode {
    const child = this.props.children
      ? React.Children.only<ReactElement<any>>(this.props.children)
      : undefined;

    if (child) {
      if (child.type === React.Fragment) {
        throw new Error(
          "A focus-trap cannot use a Fragment as its child container. Use a <div> instead."
        );
      }

      const callbackRef = (element: HTMLElement | null) => {
        const { containerElements } = this.props;

        if (child) {
          if (typeof child.props.ref === "function") {
            child.props.ref(element);
          } else if (child.props.ref && "current" in child.props.ref) {
            child.props.ref.current = element;
          }
        }

        this.focusTrapElements =
          containerElements ?? ([element].filter(Boolean) as HTMLElement[]);
      };

      return React.cloneElement(child, {
        ref: callbackRef,
      });
    }

    return null;
  }
}
