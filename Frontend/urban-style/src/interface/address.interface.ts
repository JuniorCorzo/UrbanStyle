export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface CreateAddress extends Omit<Address, "id"> {}
export interface UpdateAddress extends Address {}

interface BaseDianApi<T> {
  estado: boolean;
  resultado: T;
}

interface DepartmentDTO {
  CODIGO_DEPARTAMENTO: string;
  NOMBRE_DEPARTAMENTO: string;
}

interface MunicipalityDTO {
  NOMBRE_MUNICIPIO: string;
}

export interface Municipality {
  municipalityName: string;
}

export interface Department {
  departmentCode: string;
  departmentName: string;
}

export interface MunicipalityDTOResponse
  extends BaseDianApi<MunicipalityDTO[]> {}
export interface DepartmentDTOResponse extends BaseDianApi<DepartmentDTO[]> {}
