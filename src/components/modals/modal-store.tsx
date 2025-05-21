import { ModalHandler } from "./modal-engine";
import { ModalSkeleton } from "./modal-skeleton";
import type { OpenModalParams } from "./types";

export function openModal({
  component,
  className,
  style,
  ...restParams
}: OpenModalParams) {
  const modalId = ModalHandler.renderModal({
    ...restParams,
    component: (
      <ModalSkeleton children={component} className={className} style={style} />
    ),
    className: "modal-center",
  });

  return {
    closeModal: () => ModalHandler.close(modalId),
    modalId,
    destroy: () => ModalHandler.destroy(modalId),
  };
}
