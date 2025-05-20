import { ModalHandler } from "./modal";
import type { OpenModalParams } from "./types";

export function openModal(params: OpenModalParams) {
  const modalId = ModalHandler.renderModal(params);

  return {
    close: ModalHandler.close(modalId),
    modalId,
    destroy: ModalHandler.destroy(modalId),
  };
}
