import SelectInput from "@/components/dashboard/react/components/inputs/SelectInput";
import { useLocationApi } from "./hook/useLocationApi";
import { transformToTitleCase } from "@/lib/transform-to-title-case";

export function DepartmentSelect() {
  const { departments, setDepartmentCode } = useLocationApi();

  return (
    <div className="w-full h-fit px-2">
      <SelectInput
        className="border-2 h-11"
        name="state"
        label="Departamento:"
        placeholder="Ej: Norte de Santander"
        onChange={(value) => setDepartmentCode(value)}
        options={departments?.map(({ departmentCode, departmentName }) => {
          return {
            value: departmentCode,
            text: transformToTitleCase(departmentName),
          };
        })}
      />
    </div>
  );
}
