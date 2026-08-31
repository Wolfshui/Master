
export interface SettingsField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'secret';
  required?: boolean;
  defaultValue?: string | number | boolean;
  helpText?: string;
  options?: readonly string[];
}

export interface SettingsSection {
  key: string;
  title: string;
  description?: string;
  fields: readonly SettingsField[];
}

export interface SettingsSchema {
  sections: readonly SettingsSection[];
}
