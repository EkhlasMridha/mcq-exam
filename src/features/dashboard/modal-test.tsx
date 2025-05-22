import { Button } from "components/button";
import { openTemplateModal } from "components/modals/modal-store";
import { ModalTest2 } from "./modal-test2";

export const ModalTest = () => {
  const openModal2 = () => {
    openTemplateModal({
      component: <ModalTest2 />,
      templateConfig: {
        header: "Modal 2",
      },
    });
  };
  return (
    <div>
      Test modal <Button onClick={openModal2}>Open modal 2</Button>
    </div>
  );
};
