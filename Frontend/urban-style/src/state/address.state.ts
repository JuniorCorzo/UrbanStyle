import type { Address } from "@/interface/address.interface";
import { computed, map } from "nanostores";

export const AddressStore = map<Address[]>([]);
export const getAddressById = (addressId: string) =>
  computed(AddressStore, (address) =>
    address.find(({ id }) => id === addressId)
  );
