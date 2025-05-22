import { cloneElement } from "react";
import { createRoot } from "react-dom/client";
import type {
  DestroyOrCloseParams,
  ModalContentParams,
  ModalStackType,
  RenderModalProps,
} from "./types";
import { generateModalId } from "./utils";

let modalRoot: HTMLElement | null = document.getElementById("modal_root");
let modalStack: ModalStackType[] = [];

export const ModalHandler = {
  count: 0,
  baseModalZIndex: 1000000,
  renderModal({
    component,
    backdropClassNames,
    backdropStyles,
    destroyOnClose = true,
    maskClose = true,
    onClose,
    showBackdrop = true,
    className,
    closeDelayInMs = 200,
  }: RenderModalProps) {
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "modal_root";
      document.body.appendChild(modalRoot);
    }
    const modalId = generateModalId();
    const modalWrapper = document.createElement("div");
    modalWrapper.id = "modal_wrapper";
    modalRoot.appendChild(modalWrapper);

    const root = createRoot(modalWrapper);

    const backdropClassName = ["open", "modal-backdrop", backdropClassNames];
    showBackdrop && backdropClassName.unshift("modal-mask");

    const closeModal = (id: string) => {
      this.close(id);
    };
    const classNames = ["modal-container", className].join(" ");
    const modalIndex = this.baseModalZIndex + this.count;

    const getModalContent = ({
      backdropClassName,
      isClosing = false,
    }: ModalContentParams) => (
      <div className={classNames} style={{ zIndex: modalIndex }}>
        <div
          className={backdropClassName}
          style={backdropStyles}
          onClick={() => maskClose && closeModal(modalId)}
        />

        {cloneElement(component, {
          onClose: () => closeModal(modalId),
          modalId: modalId,
          isClosing: isClosing,
        })}
      </div>
    );
    ++ModalHandler.count;

    modalStack.push({
      modalId: modalId,
      modalRoot: root,
      destroyOnClose,
      visible: true,
      modalWrapper,
      closeDelayInMs,
      onClose,
      initiateClose: () => {
        backdropClassName.shift();
        backdropClassName.unshift("close");
        const modal = getModalContent({
          backdropClassName: backdropClassName.join(" ").trim(),
          isClosing: true,
        });

        root.render(modal);
      },
    });
    root.render(
      getModalContent({ backdropClassName: backdropClassName.join(" ").trim() })
    );

    return modalId;
  },

  destroyOrClose({
    destroy = false,
    modal,
    closeInfoEmit = true,
  }: DestroyOrCloseParams) {
    closeInfoEmit && modal.initiateClose();
    modal.visible = false;

    setTimeout(() => {
      modal?.onClose?.();
      if (!modal.destroyOnClose && !destroy) {
        modal.modalWrapper.style.display = "none";
      } else {
        modal.modalRoot.unmount();
        modal.modalWrapper.remove();
        const index = modalStack.indexOf(modal);
        modalStack.splice(index, 1);
      }
    }, modal.closeDelayInMs);

    --ModalHandler.count;
  },

  close(id: string | ModalStackType) {
    let modal: ModalStackType | null = null;
    if (typeof id === "string") {
      modal = modalStack.find((a) => a.modalId === id) || null;
    } else {
      modal = id;
    }

    if (!modal) return null;
    this.destroyOrClose({ modal });

    return modal.modalId;
  },

  destroy(id: string) {
    const modal = modalStack.find((a) => a.modalId === id);
    if (!modal) return null;
    this.destroyOrClose({ modal, destroy: true });

    return modal.modalId;
  },

  closeTop() {
    for (let i = modalStack.length - 1; i >= 0; --i) {
      if (modalStack[i].visible) {
        this.close(modalStack[i]);
        break;
      }
    }
  },

  clearAll() {
    for (const modal of modalStack) {
      this.destroyOrClose({ modal, closeInfoEmit: false, destroy: true });
    }
  },
};
