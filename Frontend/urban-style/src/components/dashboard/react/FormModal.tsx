import FileInput from "./FileInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { useFormModal } from "./hooks/useFormModal";

function FormModal() {
  const { isOpen, handleModal, formData, handleSubmit } = useFormModal();

  return (
    <dialog
      open={isOpen}
      id="form_modal"
      className="w-full max-w-[45rem] max-h-10/12 pb-5 h-fit bg-background border border-border rounded inset-0 mx-auto top-[50%] translate-y-[-50%] z-50 flex-col items-center justify-center overflow-auto"
    >
      <div className="sticky top-0 py-2.5 bg-accent border-b border-border  w-full flex items-center justify-between px-4 text-center">
        <h2 className="font-bold text-text text-2xl">Añadir Producto</h2>
        <button
          onClick={handleModal}
          id="button_close"
          type="button"
          className="text-text cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
            aria-label="Close modal"
          >
            <title id="closeModalTitle">Close modal</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <form
        method="dialog"
        className="w-full max-w-[43rem] grid grid-cols-[repeat(auto-fill,minmax(13rem,18rem))] grid-flow-row-dense py-5 gap-6 justify-center overflow-y-auto"
        data-astro-reload
        onSubmit={handleSubmit}
      >
        {formData?.fields?.map(({ type, fieldProperties }, index) => {
          const { name } = fieldProperties;
          if (type === "select") {
            return <SelectInput key={name} {...fieldProperties} />;
          }

          if (type === "file") {
            return <FileInput key={name} />;
          }

          return <TextInput key={name} {...fieldProperties} />;
        })}
        <div className="w-full flex justify-center col-span-full">
          <button
            className="bg-accent w-40 h-10 px-10 border border-border rounded text-text text-xl font-semibold cursor-pointer pointer-events-auto hover:bg-accent/80 active:bg-accent/90 focus:outline-none focus:custom-ring"
            type="submit"
          >
            Enviar
          </button>
        </div>
      </form>
      <div
        id="modal_backdrop"
        className="absolute hidden inset-0 backdrop-blur-xs bg-background/5 z-20"
      />
    </dialog>
  );
}

export default FormModal;
