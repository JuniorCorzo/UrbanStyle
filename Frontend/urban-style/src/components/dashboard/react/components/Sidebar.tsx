import { cn } from "@/lib/cn";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useForm } from "../hooks/useForm";
import { ProductFormFields } from "@/components/dashboard/react/components/forms/ProductFormFields";
import { CategoriesFormFields } from "./forms/CategoriesFormFields";
import { Button } from "@/components/react/Button";

export interface FormFieldsProps<T> {
  getDefaultValues: () => T | undefined;
}

export function Sidebar() {
  const {
    visible,
    formType,
    handleOpen,
    handleSubmit,
    title,
    id,
    getProductValues,
    getCategoryValues,
  } = useForm();

  return (
    <aside
      className={cn(
        "bg-background fixed right-0 invisible w-full max-w-xl min-h-dvh h-full ml-5 pb-14 overflow-auto border-l-2  border-border z-50",
        visible && "visible animate-aside-open",
        formType && "animate-aside-close"
      )}
    >
      <div className="sticky top-0 bg-accent/70 backdrop-blur-xs flex justify-between items-center px-5 py-3 z-[9999]">
        <h2 className="text-xl font-medium text-text">{title}</h2>
        <XMarkIcon
          onClick={handleOpen}
          className="size-7 cursor-pointer"
        ></XMarkIcon>
      </div>
      <div>
        <form
          method="dialog"
          className="w-full flex flex-col justify-center items-center gap-4 pt-4 overflow-y-auto"
          data-astro-reload
          onSubmit={handleSubmit}
        >
          <div className="w-full max-w-md flex flex-col justify-center items-center gap-4">
            {formType === "product" && (
              <ProductFormFields key={id} getDefaultValues={getProductValues} />
            )}
            {formType === "category" && (
              <CategoriesFormFields
                key={id}
                getDefaultValues={getCategoryValues}
              />
            )}
            <div className="w-full flex justify-center col-span-full">
              <Button className="w-full" type="submit">
                Enviar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </aside>
  );
}
