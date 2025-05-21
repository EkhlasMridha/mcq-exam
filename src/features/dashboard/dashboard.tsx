import { Button } from "components/button";
import { openModal } from "components/modals";
import { ModalTest } from "./modal-test";

export const Dashboard = () => {
  const onOpenModal = () => {
    openModal({
      component: <ModalTest />,
      maskClose: false,
    });
  };
  return (
    <div>
      Hello dashboard
      <Button onClick={onOpenModal}>Open modal</Button>
    </div>
  );
};
