export interface FormMediator {
  formConfig: (id?: string) => Promise<FormConfig>;
  sendData: (formData: FormData) => void;
}

export interface FormConfig {
  title: string;
  fields: FormField[];
}

export type FormFieldType = "select" | "text" | "file";

export interface FormField {
  type: FormFieldType;
  fieldProperties: FieldProperties;
}

export interface FieldProperties {
  label?: string;
  name?: string;
  value?: string | string[];
  placeholder?: string;
  required?: boolean;
  options?: SelectOptions[];
  isMultiple?: boolean;
}

export type SelectOptions = {
  value: string;
  text: string;
};
