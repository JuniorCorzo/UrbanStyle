import { cn } from "@/lib/cn";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Attributes } from "@/interface/product.interface";

interface AttributesWithId extends Attributes {
  id: string;
}

interface AttributeTableProps {
  attributes: AttributesWithId[];
  onRemove: (id: string) => void;
}

/**
 * AttributeTable displays a table of product attributes with a remove action for each row.
 */
export function AttributeTable({ attributes, onRemove }: AttributeTableProps) {
  return (
    <div className={cn("flex flex-col")}>
      <table className="table-auto text-center border border-separate border-spacing-0 shadow shadow-accent border-border rounded text-text">
        <thead className="bg-accent h-10">
          <tr>
            <th>Color</th>
            <th>Tallas</th>
            <th>Stock</th>
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
              <td>{quantity}</td>
              <td className="h-10 flex justify-center items-center px-4">
                <span
                  className="cursor-pointer group"
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
