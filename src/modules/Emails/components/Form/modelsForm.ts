export interface Inputs {
  id: number;
  field: string;
  inputName: string;
  outlined?: boolean;
  label?: string;
  dense?: boolean;
  class?: string;
}

export interface TemplateValues {
  id?: number;
  description: string;
  division: string;
  document: Array<any>;
  module: string;
  name: string;
  subject: string;
  surveys: Array<any>;
  userAssigned: string;
  type: string;
  variable: string;
}
