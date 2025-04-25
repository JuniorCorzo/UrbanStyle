import type {
  FormConfig,
  FormMediator,
} from "@/interface/form-mediator.interface";

export async function categoriesForm(): Promise<FormMediator> {
  const formConfig: FormConfig = {
    title: "Categories",
    fields: [
      {
        type: "text",
        fieldProperties: {
          label: "Nombre",
          name: "name",
          placeholder: "Nombre de la categoría",
          required: true,
        },
      },
      {
        type: "text",
        fieldProperties: {
          label: "Descripción",
          name: "description",
          placeholder: "Descripción de la categoría",
          required: true,
        },
      },
    ],
  };

  return {
    formConfig,
  };
}
