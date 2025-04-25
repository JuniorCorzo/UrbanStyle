import { TABLE_MEDIATOR_METADATA } from "@/const/table-mediator.const";
import type { FormConfig } from "@/interface/form-mediator.interface";
import { DashboardMediator } from "@/lib/dashboard-mediator";
import { $ } from "@/lib/dom-selector";
import { useEffect, useState, type FormEvent } from "react";

export function useFormModal() {
  const [formData, setFormData] = useState<FormConfig>();
  const [isOpen, setIsOpen] = useState(false);
  const { mediatorSearchParam } = TABLE_MEDIATOR_METADATA;
  const searchParam = new URLSearchParams(document.location.search).get(
    mediatorSearchParam
  );

  const handleModal = () => {
    setIsOpen((prev) => !prev);
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
    (async () => {
      const dashboardMediator = await DashboardMediator(searchParam as string);
      const formConfig = dashboardMediator?.form.formConfig;
      setFormData(formConfig);
    })();
  }, [searchParam]);

  useEffect(() => {
    window.addEventListener("open-modal", handleModal);
    return () => {
      window.removeEventListener("open-modal", handleModal);
    };
  });

  return {
    formData,
    isOpen,
    handleModal,
    handleSubmit,
  };
}
