export interface FormMediator {
  formConfig: FormConfig;
}

export interface FormConfig {
  title: string;
  fields: FormField[];
  sendData: (data: FormData) => void;
}

export interface FormField {
  type: "select" | "text";
  fieldProperties: FieldProperties;
}

export interface FieldProperties {
  label?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  options?: SelectOptions[];
  isMultiple?: boolean;
}

export type SelectOptions = {
  value: string;
  text: string;
};
