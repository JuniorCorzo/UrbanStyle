import SelectInput from "@/components/dashboard/react/components/inputs/SelectInput";
import type { Address } from "@/interface/address.interface";
import { AddressService } from "@/service/address.service";
import { use, useEffect, useState } from "react";

interface Props {
  userId: string;
}

export function AddressSelect({ userId }: Props) {
  const [address, setAddress] = useState<Address[]>();

  useEffect(() => {
    AddressService.getAddressByUserId(userId).then((address) =>
      setAddress(address)
    );
  }, []);

  return (
    <SelectInput
      placeholder="Dirección de envío"
      options={address?.map(({ id, street, city }) => {
        return { value: id, text: `${street}, ${city}` };
      })}
    />
  );
}
