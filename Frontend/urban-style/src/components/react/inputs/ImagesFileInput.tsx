import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import bytes from "bytes";
import { useLayoutEffect, useRef, useState, type ChangeEvent } from "react";
import FileInput from "./FileInput";
import { CLOUDFLARE_URL } from "@/config/env-config";

interface ImageState {
  imageName: string;
  imageUrl: string;
  file: File;
}

interface Props {
  label: string;
  name: string;
  defaultImages?: string[];
}

export function ImagesFileInput({ name, defaultImages }: Props) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageState[]>();

  useLayoutEffect(() => {
    if (!defaultImages) return;
    const imagesState = defaultImages?.map(async (image) => {
      const imageUrl = `${CLOUDFLARE_URL}/${image}`;
      const imageResponse = await fetch(imageUrl, {
        mode: "cors",
      });
      const imageBlob = await imageResponse.blob();

      const file = new File([imageBlob], image, {
        type: imageBlob.type,
      });
      return { imageName: image, imageUrl, file } as ImageState;
    });

    Promise.all(imagesState).then((images) => setImages(images));
  }, []);

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    if (!files) return;
    const images: ImageState[] = Array.from(files).map((file) => ({
      imageName: file.name,
      imageUrl: URL.createObjectURL(file),
      file: file,
    }));
    setImages(images);
  };

  const handleRemoveAt = () => {
    if (!inputFileRef.current) return;

    const dataTransfer = new DataTransfer();
    images?.map(({ file }) => dataTransfer.items.add(file));
    inputFileRef.current.files = dataTransfer.files;
  };

  const handleDeleteImage = (urlDelete: string) => {
    setImages(images?.filter(({ imageUrl }) => imageUrl !== urlDelete));
    handleRemoveAt();
  };

  return (
    <>
      <FileInput
        ref={inputFileRef}
        onChange={handleFiles}
        name={name}
        accept="image/**"
      />
      <div className="w-full flex flex-col justify-center gap-5">
        {images?.map(({ imageName, imageUrl, file }) => (
          <div
            className="w-full bg-accent px-5 py-3 rounded-lg flex justify-between items-center gap-5"
            key={imageUrl}
          >
            <img className="size-28 aspect-square" src={imageUrl} />
            <span className="flex flex-col gap-2">
              <h3 className="font-medium">{imageName.split(".")[0]}</h3>
              <span>{bytes(file.size, { unitSeparator: " " })}</span>
            </span>
            <span onClick={() => handleDeleteImage(imageUrl)}>
              <TrashIcon className="size-7 cursor-pointer hover:scale-105 stroke-maroon"></TrashIcon>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
