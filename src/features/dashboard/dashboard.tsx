import { Button } from "components/button";
import { openModal } from "components/modals";
import { ModalTest } from "./modal-test";
import { openTemplateModal } from "components/modals/modal-store";

export const Dashboard = () => {
  const onOpenModal = () => {
    openTemplateModal({
      maskClose: false,
      component: <ModalTest />,
      style: {
        width: "100%",
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
