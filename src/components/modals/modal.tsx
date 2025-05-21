import { createRoot } from "react-dom/client";
import type { ModalStackType, RenderModalProps } from "./types";
import { generateModalId } from "./utils";
import { cloneElement } from "react";

let modalRoot: HTMLElement | null = document.getElementById("modal_root");
let modalStack: ModalStackType[] = [];

export const ModalHandler = {
  count: 0,
  renderModal({
    component,
    backdropClassNames,
    backdropStyles,
    destroyOnClose = true,
    maskClose = true,
    onClose,
    showBackdrop = true,
    className,
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

    const backdropClassName = ["modal-backdrop", backdropClassNames]
      .join(" ")
      .trim();

    const closeModal = (id: string) => {
      this.close(id);
    };
    const classNames = ["modal-container", className].join(" ");

    const modal = (
      <div
        className={classNames}
        style={{ zIndex: 9999999999 + ModalHandler.count }}
        onClick={() => maskClose && closeModal(modalId)}
      >
        {showBackdrop && (
          <div className={backdropClassName} style={backdropStyles} />
        )}
        <div onClick={(event) => event.stopPropagation()}>
          {cloneElement(component, { onClose: () => closeModal(modalId) })}
        </div>
      </div>
    );
    ++ModalHandler.count;

    modalStack.push({
      modalId: modalId,
      modalRoot: root,
      destroyOnClose,
      visible: true,
      modalWrapper,
      onClose,
    });
    root.render(modal);

    return modalId;
  },

  close(id: string | ModalStackType) {
    let modal: ModalStackType | null = null;
    if (typeof id === "string") {
      modal = modalStack.find((a) => a.modalId === id) || null;
    } else {
      modal = id;
    }

    if (!modal) return null;

    if (!modal.destroyOnClose) {
      modal.visible = false;
      modal.modalWrapper.style.display = "none";
    } else {
      modal.modalRoot.unmount();
      modal.modalWrapper.remove();
      const index = modalStack.indexOf(modal);
      modalStack.splice(index, 1);
    }
    --ModalHandler.count;
    modal?.onClose?.();
    return modal.modalId;
  },

  destroy(id: string) {
    const modal = modalStack.find((a) => a.modalId === id);
    if (!modal) return null;

    modal.modalRoot.unmount();
    modal.modalWrapper.remove();
    const index = modalStack.indexOf(modal);
    modalStack.splice(index, 1);

    --ModalHandler.count;
    modal?.onClose?.();
    return modal.modalId;
  },

  closeTop() {
    let modalId: string | null = null;
    for (let i = 0; i < modalStack.length; --i) {
      if (modalStack[i].visible) {
        modalId = this.close(modalStack[i]);
        break;
      }
    }
    return modalId;
  },
};
