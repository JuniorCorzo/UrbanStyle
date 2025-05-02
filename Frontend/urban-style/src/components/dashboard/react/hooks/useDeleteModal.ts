import type { OpenDeleteModal } from "@/lib/utils/open-modal-event";
import { useEffect, useRef, useState, type MouseEvent } from "react";

export function useDeleteModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = useRef(false);
  const [detailsEvent, setDetailsEvent] = useState<OpenDeleteModal>();

  const handleClose = () => {
    dialogRef.current?.classList.remove("flex");
    open.current = false;
  };

  const handleOpen = (
    event?: CustomEvent<OpenDeleteModal> | MouseEvent<HTMLButtonElement>
  ) => {
    if (open.current) {
      dialogRef.current?.close();
      open.current = false;
      return;
    }

    if (event instanceof CustomEvent) {
      setDetailsEvent(event?.detail);
    }

    dialogRef.current?.showModal();
    dialogRef.current?.classList.add("flex");
    open.current = true;
  };

  const handleSendRequest = () => {
    if (detailsEvent) {
      const { id, sendDelete } = detailsEvent;
      sendDelete(id);
    }
  };

  useEffect(() => {
    window.addEventListener("open-delete-modal", (event: Event) =>
      handleOpen(event as CustomEvent<OpenDeleteModal>)
    );
    return () => {
      window.removeEventListener("open-delete-modal", (event: Event) =>
        handleOpen(event as CustomEvent<OpenDeleteModal>)
      );
    };
  }, []);

  return {
    title: detailsEvent?.typeModal,
    dialogRef,
    handleClose,
    handleOpen,
    handleSendRequest,
  };
}
