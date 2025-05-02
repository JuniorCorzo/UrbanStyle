import type { FormConfig, SendForm } from "@/interface/form-mediator.interface";
import { $ } from "@/lib/dom-selector";
import type { OpenModalEvent } from "@/lib/utils/open-modal-event";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import SlimSelect from "slim-select";

export function useFormModal() {
  const [formData, setFormData] = useState<FormConfig>();
  const [sendForm, setSendForm] = useState<SendForm>();
  const [id, setId] = useState<string>();

  const [isOpen, setIsOpen] = useState(false);

  const handleModal = (
    event?: CustomEvent<OpenModalEvent> | MouseEvent<HTMLButtonElement>
  ) => {
    setIsOpen((prev) => !prev);
    if (event instanceof CustomEvent && event.detail) {
      const { formData, sendForm, id } = event.detail;
      setFormData(formData);
      setSendForm(() => sendForm);
      setId(id);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Get values from SlimSelect instances
    const selects = form.querySelectorAll("select");
    selects.forEach((select) => {
      const slimSelect = new SlimSelect({
        select: select,
      });

      if (slimSelect) {
        const value = slimSelect.getSelected();
        formData.delete(select.name);

        if (Array.isArray(value)) {
          value.forEach((v) => {
            formData.append(select.name, v);
          });
        } else {
          formData.append(select.name, value);
        }
      }
    });

    // Get files from file inputs
    const fileInputs = form.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      const files = (input as HTMLInputElement).files;
      if (files && files.length > 0) {
        formData.delete((input as HTMLInputElement).name);

        console.log((input as HTMLInputElement).name);
        Array.from(files).forEach((file) => {
          formData.append((input as HTMLInputElement).name || "files", file);
        });
      } else {
        formData.delete((input as HTMLInputElement).name);
      }
    });

    if (id) formData.append("id", id);

    if (typeof sendForm === "function") {
      try {
        sendForm(formData);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
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
