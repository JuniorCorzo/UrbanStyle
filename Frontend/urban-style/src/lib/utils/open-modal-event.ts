import type { FormConfig } from "@/interface/form-mediator.interface";

export interface OpenModalEvent {
  formData: FormConfig;
}

export function openModalEvent(formData: FormConfig) {
  window.dispatchEvent(
    new CustomEvent<OpenModalEvent>("open-modal", {
      detail: {
        formData,
      },
    })
  );
}
