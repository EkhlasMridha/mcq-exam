import { Button } from "components/button";
import { openTemplateModal } from "components/modals/modal-store";
import { ModalTest } from "./modal-test";

export const Dashboard = () => {
  const onOpenModal = () => {
    openTemplateModal({
      // showBackdrop: false,
      component: <ModalTest />,
      style: {
        width: "100%",
        maxWidth: "600px",
      },
      templateConfig: {
        header: "My modal",
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
