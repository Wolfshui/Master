
export type FieldType = 'text' | 'textarea' | 'email' | 'number' | 'select' | 'checkbox' | 'date';

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  hint?: string;
  options?: readonly string[];
  validation?: FieldValidation;
}

export interface FormDefinition {
  id: string;
  installationId: string;
  key: string;
  version: number;
  title: string;
  description?: string;
  submitPermission: string;
  fields: readonly FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  installationId: string;
  formId: string;
  submittedBy?: string;
  workflowInstanceId?: string;
  payload: Record<string, string | number | boolean | null>;
  submittedAt: string;
}
