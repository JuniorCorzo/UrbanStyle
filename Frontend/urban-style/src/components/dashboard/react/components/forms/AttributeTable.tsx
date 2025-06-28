import { cn } from "@/lib/cn";
import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Attributes } from "@/interface/product.interface";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputEvent,
  type KeyboardEvent,
} from "react";

interface AttributesWithId extends Attributes {
  id: string;
}

interface AttributeTableProps {
  attributes: AttributesWithId[];
  onRemove: (id: string) => void;
  onChangeQuantity: (id: string, quantity: number) => void;
}

export function AttributeTable({
  attributes,
  onRemove,
  onChangeQuantity,
}: AttributeTableProps) {
  const [isEditStock, setIsEditStock] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const idEditable = useRef<string>(null);

  const handleEdit = (id: string) => {
    if (isEditStock) return;

    idEditable.current = id;
    setIsEditStock(true);
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.currentTarget.value;
    event.currentTarget.value = value.replaceAll(/\D/g, "");
  };

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && idEditable.current) {
      event.preventDefault();
      handleDone();
    }
  };

  const handleDone = () => {
    if (!idEditable.current || !inputRef.current) return;
    onChangeQuantity(idEditable.current, Number(inputRef.current.value));
    setIsEditStock(false);
  };

  const isEditable = (id: string) =>
    isEditStock && !!idEditable.current && idEditable.current === id;

  useEffect(() => {
    if (isEditStock && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditStock]);

  return (
    <div className={cn("flex flex-col")}>
      <table className="table-auto text-center border border-separate border-spacing-0 shadow shadow-accent border-border rounded text-text">
        <thead className="bg-accent h-10">
          <tr>
            <th>Color</th>
            <th>Tallas</th>
            <th className="w-32">Stock</th>
            <th className="w-5"></th>
          </tr>
        </thead>
        <tbody className="">
          {attributes.length === 0 && (
            <tr className="h-10">
              <td colSpan={4}>
                <span>No tienes atributos</span>
              </td>
            </tr>
          )}
          {attributes.map(({ id, color, size, quantity }) => (
            <tr
              className="h-10 border-border even:bg-accent/50 backdrop-blur-xs"
              key={id}
            >
              <td className="">{color}</td>
              <td>{size}</td>
              <td>
                {isEditable(id) ? (
                  <input
                    ref={inputRef}
                    className="w-14 px-0.5 border border-border focus:custom-ring"
                    onChange={handleChangeInput}
                    onKeyDown={handleKey}
                    accept="/\D/g"
                    defaultValue={quantity}
                  />
                ) : (
                  <span>{quantity}</span>
                )}
              </td>
              <td className="h-10 flex gap-3 items-center px-4">
                <span className="cursor-pointer group">
                  {isEditable(id) ? (
                    <CheckIcon
                      className="size-5 group-hover:scale-120"
                      title="Hecho"
                      onClick={handleDone}
                    />
                  ) : (
                    <PencilIcon
                      className={cn(
                        "size-5 group-hover:scale-120",
                        isEditStock && "cursor-no-drop group-hover:scale-100"
                      )}
                      title="Modificar el stock"
                      onClick={() => handleEdit(id)}
                    />
                  )}
                </span>
                <span
                  className="cursor-pointer group"
                  title="Eliminar atributo"
                  onClick={() => onRemove(id)}
                >
                  <TrashIcon className="size-5 group-hover:scale-120" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
