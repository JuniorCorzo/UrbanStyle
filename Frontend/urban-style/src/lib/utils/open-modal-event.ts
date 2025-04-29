import type { FormConfig, SendForm } from "@/interface/form-mediator.interface";

export interface OpenModalEvent {
  formData: FormConfig;
  sendForm: SendForm;
  id?: string;
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
