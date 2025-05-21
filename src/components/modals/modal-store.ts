import { ModalHandler } from "./modal";
import type { OpenModalParams } from "./types";

export function openModal(params: OpenModalParams) {
  const modalId = ModalHandler.renderModal({
    ...params,
    className: "modal-center",
  });

  return {
    closeModal: () => ModalHandler.close(modalId),
    modalId,
    destroy: () => ModalHandler.destroy(modalId),
  };
}
