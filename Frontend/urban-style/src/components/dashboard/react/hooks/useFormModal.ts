import type { FormConfig } from "@/interface/form-mediator.interface";
import { $ } from "@/lib/dom-selector";
import type { OpenModalEvent } from "@/lib/utils/open-modal-event";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";

export function useFormModal() {
  const [formData, setFormData] = useState<FormConfig>();
  const [isOpen, setIsOpen] = useState(false);

  const handleModal = (
    event?: CustomEvent<OpenModalEvent> | MouseEvent<HTMLButtonElement>
  ) => {
    setIsOpen((prev) => !prev);
    if (event instanceof CustomEvent && event.detail) {
      const { formData } = event.detail;
      setFormData(formData);
    }
    handleBackdrop();
  };

  const handleBackdrop = () => {
    const $modalBackdrop = $("#modal_backdrop");
    $modalBackdrop?.classList.toggle("hidden");
    $modalBackdrop?.addEventListener("click", () => handleModal());
    window?.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        handleModal();
      }
    });
    document.body.appendChild($modalBackdrop as HTMLElement);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener("open-modal", (e: Event) =>
      handleModal(e as CustomEvent<OpenModalEvent>)
    );
    return () => {
      window.removeEventListener("open-modal", (e: Event) =>
        handleModal(e as CustomEvent<OpenModalEvent>)
      );
    };
  });

  return {
    formData,
    isOpen,
    handleModal,
    handleSubmit,
  };
}
