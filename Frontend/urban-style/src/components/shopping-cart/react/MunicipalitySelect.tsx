import SelectInput from "@/components/react/inputs/SelectInput";
import { transformToTitleCase } from "@/lib/transform-to-title-case";
import { MunicipalityStore } from "@/state/location.state";
import { useStore } from "@nanostores/react";

export function MunicipalitySelect() {
  const municipality = useStore(MunicipalityStore);

  return (
    <div className="w-full h-fit px-2">
      <SelectInput
        className="border-2 h-11"
        disable={!(municipality.length > 0)}
        name="city"
        label="Municipios:"
        placeholder="Ej: Cúcuta"
        options={municipality?.map(({ municipalityName }) => {
          return {
            text: transformToTitleCase(municipalityName),
            value: municipalityName,
          };
        })}
      />
    </div>
  );
}
