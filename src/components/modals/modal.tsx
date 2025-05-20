import { createRoot } from "react-dom/client";
import type { ModalStackType, RenderModalProps } from "./types";
import { generateModalId } from "./utils";
import { cloneElement } from "react";

let modalRoot: HTMLDivElement | null = null;
let modalStack: ModalStackType[] = [];

export const ModalHandler = {
  renderModal({
    component,
    backdropClassNames,
    backdropStyles,
    destroyOnClose,
    maskClose,
    onClose,
    showBackdrop = true,
  }: RenderModalProps) {
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "modal_root";
      document.body.appendChild(modalRoot);
    }
    const modalId = generateModalId();
    const modalWrapper = document.createElement("div");
    modalRoot.appendChild(modalWrapper);

    const root = createRoot(modalWrapper);

    const backdropClassName = ["modal-backdrop", backdropClassNames]
      .join(" ")
      .trim();

    const closeModal = (id: string) => {
      this.close(id);
    };

    const modal = (
      <div
        className="modal-container"
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

    root.render(modal);
    modalStack.push({
      modalId: modalId,
      modalRoot: root,
      destroyOnClose,
      visible: true,
      modalWrapper,
      onClose,
    });

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
    }
    modal?.onClose?.();
    return modal.modalId;
  },

  destroy(id: string) {
    const modal = modalStack.find((a) => a.modalId === id);
    if (!modal) return null;

    modal.modalRoot.unmount();
    modal.modalWrapper.remove();
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
