import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  handleModal: () => void;
  title: string;
}

export default function ModalHeader({ handleModal, title }: Props) {
  return (
    <div className="sticky top-0 py-2.5 bg-accent border-b border-border  w-full flex items-center justify-between px-4 text-center z-50">
      <h2 className="font-bold text-text text-2xl">{title}</h2>
      <button
        onClick={handleModal}
        id="button_close"
        type="button"
        className="text-text cursor-pointer"
      >
        <XMarkIcon className="size-6" />
      </button>
    </div>
  );
}
