import ModalHeader from "./ModalHeader";
import { useDeleteModal } from "../../hooks/useDeleteModal";

export default function FormDeleteModal() {
  const { title, dialogRef, handleClose, handleOpen, handleSendRequest } =
    useDeleteModal();

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className={`w-full max-w-sm max-h-10/12 h-fit bg-background border border-border rounded-lg inset-0 mx-auto top-[50%] translate-y-[-50%] z-50 flex-col items-center justify-center backdrop:bg-background/5 backdrop:backdrop-blur-xs focus:custom-ring `}
    >
      <ModalHeader handleModal={handleOpen} title={`Eliminar ${title}`} />
      <section className="w-full px-5 pt-2 pb-5 flex flex-col items-center gap-2">
        <span className="text-text text-lg">¿Estas Seguro?</span>
        <article className="w-full flex justify-between">
          <button
            className="w-40 py-1 border border-border focus:custom-ring hover:custom-ring cursor-pointer rounded-md text-text"
            type="button"
            onClick={handleOpen}
          >
            Cancel
          </button>
          <button
            className="w-40 py-1 bg-accent border border-border focus:custom-ring hover:custom-ring cursor-pointer rounded-md text-text"
            type="button"
            onClick={handleSendRequest}
          >
            Confirmar
          </button>
        </article>
      </section>
    </dialog>
  );
}
