import type { FormType, SendForm } from "@/interface/form-mediator.interface";
import type { OpenModalEvent } from "@/lib/utils/open-modal-event";
import { categoriesStore } from "@/state/categories.store";
import { productStore } from "@/state/product.store";
import { useStore } from "@nanostores/react";
import { useEffect, useRef, useState, type FormEvent } from "react";

export function useForm() {
  const sendForm = useRef<SendForm>(null);
  const titleRef = useRef<string>(null);
  const [id, setId] = useState<string>();
  const formType = useRef<FormType>(null);
  const [visible, setVisible] = useState(false);

  const products = useStore(productStore);
  const categories = useStore(categoriesStore);

  const handleOpen = () => setVisible((prev) => !prev);

  const handleFormConfig = (event: CustomEvent<OpenModalEvent>) => {
    const { formType: form, sendData, title, id: idDocument } = event.detail;
    formType.current = form;
    sendForm.current = sendData;
    titleRef.current = title;
    setId(idDocument);

    handleOpen();
  };

  const getProductValues = () =>
    products.find(({ id: productId }) => productId === id);

  const getCategoryValues = () =>
    categories.find(({ id: categoryId }) => categoryId === id);

  useEffect(() => {
    window.addEventListener("open-modal", (e: Event) => {
      handleFormConfig(e as CustomEvent<OpenModalEvent>);
    });

    return () => {
      window.removeEventListener("open-modal", (e: Event) =>
        handleFormConfig(e as CustomEvent<OpenModalEvent>)
      );
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (typeof sendForm.current !== "function") return;
      sendForm.current(formData, id);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return {
    id,
    title: titleRef.current,
    formType: formType.current,
    getProductValues,
    getCategoryValues,
    visible,
    handleOpen,
    handleSubmit,
  };
}
