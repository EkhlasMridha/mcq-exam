import { Button } from "components/button";
import { openConfirmationModal } from "components/modals/modal-store";

export const Dashboard = () => {
  const onOpenModal = () => {
    openConfirmationModal({
      maskClose: false,
      confirmationConfig: {
        titleText: "Are your sure to continue?",
        description: "Once done there will be no way back.",
        cancelText: "Not now",
        confirmText: "Confirm",
        onConfirm: () => {
          console.log("confirm");
        },
      },
    });
  };
  return (
    <div>
      Hello dashboard
      <Button onClick={onOpenModal}>Open modal</Button>
    </div>
  );
};
