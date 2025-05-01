import { $ } from "@/lib/dom-selector";

export function useBackdrop(handleModal: () => void) {
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
  return { handleBackdrop };
}
