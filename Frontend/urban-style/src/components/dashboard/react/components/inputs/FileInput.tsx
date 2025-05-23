import type { FieldProperties } from "@/interface/form-mediator.interface";

interface Props extends FieldProperties {}

export default function FileInput({ name }: Props) {
  return (
    <div className="relative h-48 rounded-lg border-2 border-border bg-background flex justify-center items-center hover:custom-ring transition-shadow duration-300 ease-in-out col-span-full">
      <div className="absolute flex flex-col items-center">
        <div className="flex items-center justify-center text-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="0.5"
            stroke="currentColor"
            className="size-28 stroke-text"
          >
            <title id="fileUploadTitle">Upload image icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
        <span className="block text-gray-500 font-semibold">
          Arrastra y suelta tus archivos aquí
        </span>
        <span className="block text-gray-400 font-normal mt-1">
          o haz click para subir
        </span>
      </div>

      <input
        name={name}
        className="h-full w-full opacity-0 cursor-pointer pointer-events-auto"
        type="file"
      />
    </div>
  );
}
