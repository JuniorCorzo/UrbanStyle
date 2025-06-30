import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import bytes from "bytes";
import FileInput from "./FileInput";
import type { Images } from "@/interface/product.interface";
import LabelInput from "./LabelInput";
import SelectInput from "./SelectInput";
import { useImages } from "../hooks/useImages";
import { cn } from "@/lib/cn";
import { MessageError } from "./MessageError";

interface Props {
  label: string;
  name: string;
  defaultImages?: Images[];
}

export function ImagesFileInput({ name, label, defaultImages = [] }: Props) {
  const {
    images,
    attributes,
    inputFileRef,
    handleFiles,
    handleDeleteImage,
    handleChangeColor,
  } = useImages(defaultImages);

  return (
    <>
      <LabelInput label={label}>
        <MessageError errorId={`${name}_error`} />
        <FileInput
          ref={inputFileRef}
          onChange={handleFiles}
          name={name}
          accept="image/**"
          multiple
        />
      </LabelInput>
      <div className="w-full flex flex-col justify-center gap-5 overflow-visible">
        {images?.map(
          ({ imageName, imageUrl, file, color, isUpload, isDelete }) => (
            <div
              className={cn(
                "w-full flex flex-col bg-accent px-5 py-4 rounded-lg gap-3",
                isDelete && "hidden"
              )}
              key={imageUrl}
            >
              <div className="flex justify-between items-center gap-5">
                <img
                  className="size-28 aspect-square rounded-md"
                  src={imageUrl}
                />
                <span className="w-full max-w-56 flex flex-col gap-5">
                  <h3 className="font-medium">{imageName.split(".")[0]}</h3>
                  <span>{bytes(file.size, { unitSeparator: " " })}</span>
                </span>
                <span
                  onClick={() => handleDeleteImage(imageUrl, isUpload)}
                  title="Eliminar imagen"
                >
                  <TrashIcon className="size-7 cursor-pointer hover:scale-105 stroke-maroon" />
                </span>
              </div>
              <div>
                <LabelInput label="Asignar color">
                  <SelectInput
                    name={imageUrl}
                    placeholder="Seleccione el color"
                    onChange={(_, newColor) =>
                      handleChangeColor(imageUrl, newColor)
                    }
                    value={
                      color
                        ? { text: color, value: color.toLowerCase() }
                        : undefined
                    }
                    options={Array.from(attributes).map((color) => ({
                      text: color,
                      value: color.toLowerCase(),
                    }))}
                  />
                </LabelInput>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
