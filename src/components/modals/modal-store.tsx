import { ConfirmationModal } from "./confirmation-modal";
import { HeadFootModalTemplate } from "./head-foot-modal-template";
import { ModalHandler } from "./modal-engine";
import { ModalSkeleton } from "./modal-skeleton";
import type {
  OpenConfirmationModalParams,
  OpenModalParams,
  OpenTemplateModalParams,
} from "./types";

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

export function openTemplateModal({
  className,
  style,
  component,
  templateConfig,
  ...restParams
}: OpenTemplateModalParams) {
  const modalId = ModalHandler.renderModal({
    ...restParams,
    backdropClassNames: "mask-animation",
    closeDelayInMs: 300,
    component: (
      <HeadFootModalTemplate
        children={component}
        className={className}
        style={style}
        {...templateConfig}
      />
    ),
    className: "modal-center",
  });

  return {
    closeModal: () => ModalHandler.close(modalId),
    modalId,
    destroy: () => ModalHandler.destroy(modalId),
  };
}

export function openConfirmationModal({
  className,
  confirmationConfig,
  style,
  ...restProps
}: OpenConfirmationModalParams) {
  const modalId = ModalHandler.renderModal({
    component: (
      <ConfirmationModal
        className={className}
        style={style}
        {...confirmationConfig}
      />
    ),
    ...restProps,
    backdropClassNames: "mask-animation",
    className: "modal-center",
    closeDelayInMs: 300,
  });

  return {
    closeModal: () => ModalHandler.close(modalId),
    modalId,
    destroy: () => ModalHandler.destroy(modalId),
  };
}
