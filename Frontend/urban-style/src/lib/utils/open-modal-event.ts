import type { FormConfig, SendForm } from "@/interface/form-mediator.interface";

export interface OpenModalEvent {
  formData: FormConfig;
  sendForm: SendForm;
  id?: string;
}

export interface OpenDeleteModal {
  typeModal: string;
  sendDelete: (id: string) => void;
  id: string;
}

export function openModalEvent(
  formData: FormConfig,
  sendForm: SendForm,
  id?: string
) {
  window.dispatchEvent(
    new CustomEvent<OpenModalEvent>("open-modal", {
      detail: {
        formData,
        sendForm,
        id,
      },
    })
  );
}

export function openDeleteModalEvent({
  typeModal,
  sendDelete,
  id,
}: OpenDeleteModal) {
  window.dispatchEvent(
    new CustomEvent<OpenDeleteModal>("open-delete-modal", {
      detail: {
        typeModal,
        sendDelete,
        id,
      },
    })
  );
}
