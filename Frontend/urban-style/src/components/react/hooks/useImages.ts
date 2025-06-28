import { CLOUDFLARE_URL } from "@/config/env-config";
import type { Images } from "@/interface/product.interface";
import { attributeStore, imagesStore } from "@/state/attributes.state";
import { productStore } from "@/state/product.store";
import { useStore } from "@nanostores/react";
import { useRef, useLayoutEffect, type ChangeEvent } from "react";

export interface ImageState {
  imageName: string;
  imageUrl: string;
  file: File;
  color: string;
  isUpload: boolean;
  isDelete?: boolean;
}

export function useImages(defaultImages: Images[]) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const images = useStore(imagesStore);
  const attributes = useStore(attributeStore);

  useLayoutEffect(() => {
    if (!defaultImages) return;
    const imagesState = defaultImages?.map(
      async ({ image, color }): Promise<ImageState> => {
        const imageUrl = `${CLOUDFLARE_URL}/${image}`;
        const imageResponse = await fetch(imageUrl, {
          mode: "cors",
        });
        const imageBlob = await imageResponse.blob();

        const file = new File([imageBlob], image, {
          type: imageBlob.type,
        });

        const imageName =
          productStore
            .get()
            .find(({ images }) => images.find((img) => img.image === image))
            ?.name ?? "";

        return { imageName, imageUrl, file, color: color, isUpload: true };
      }
    );

    Promise.all(imagesState).then((images) => imagesStore.set(images));
  }, []);

  const handleChangeColor = (imageUrl: string, color: string) => {
    imagesStore.set(
      images.map((image) =>
        image.imageUrl === imageUrl ? { ...image, color } : image
      )
    );
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    if (!files) return;
    const image: ImageState[] = Array.from(files).map((file) => ({
      imageName: file.name,
      imageUrl: URL.createObjectURL(file),
      file: file,
      color: "",
      isUpload: false,
    }));

    imagesStore.set([...images, ...image]);
  };

  const handleRemoveAt = () => {
    if (!inputFileRef.current) return;

    const dataTransfer = new DataTransfer();
    images?.map(({ file }) => dataTransfer.items.add(file));
    inputFileRef.current.files = dataTransfer.files;
  };

  const handleDeleteImage = (urlDelete: string, isUpload: boolean) => {
    if (isUpload) {
      imagesStore.set(
        images.map((image) =>
          urlDelete === image.imageUrl ? { ...image, isDelete: true } : image
        )
      );

      return;
    }

    imagesStore.set(images?.filter(({ imageUrl }) => imageUrl !== urlDelete));
    handleRemoveAt();
  };

  return {
    images,
    attributes: new Set(attributes.map(({ color }) => color)),
    inputFileRef,
    handleDeleteImage,
    handleFiles,
    handleChangeColor,
  };
}
