import {
  openDeleteModalEvent,
  openModalEvent,
} from "@/lib/utils/open-modal-event";
import { selectMediator } from "@/lib/utils/select-mediator";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  id: string;
}

const TableActions: React.FC<Props> = ({ id }) => {
  const handleUpdate = async () => {
    const dashboardMediator = await selectMediator();
    if (dashboardMediator) {
      const { title, formType, sendData } = dashboardMediator.form;
      openModalEvent(title, formType, sendData, id);
    }
  };

  const handleDelete = async () => {
    const dashboardMediator = await selectMediator();
    if (dashboardMediator) {
      const { sendDelete, title } = dashboardMediator.form;
      openDeleteModalEvent({
        typeModal: title,
        sendDelete,
        id,
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div id="edit">
        <button type="button" className="cursor-pointer" onClick={handleUpdate}>
          <PencilSquareIcon className="size-6" />
        </button>
      </div>
      <div id="delete">
        <button type="button" className="cursor-pointer" onClick={handleDelete}>
          <TrashIcon className="size-6" />
        </button>
      </div>
    </div>
  );
};

export default TableActions;
