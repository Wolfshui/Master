
# Forms and Workflow Schemas

```ts
export type FieldType = 'text' | 'textarea' | 'email' | 'number' | 'select' | 'checkbox' | 'date';

export interface FormDefinition {
  id: string;
  installationId: string;
  key: string;
  version: number;
  title: string;
  description?: string;
  fields: readonly FormField[];
  submitPermission: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: readonly string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface WorkflowDefinition {
  id: string;
  installationId: string;
  key: string;
  version: number;
  title: string;
  states: readonly WorkflowState[];
  transitions: readonly WorkflowTransition[];
}
```

## Modeling rules

- Forms own input shape and validation intent.
- Workflow definitions own state graphs and transition guards.
- A form submission may optionally create or advance a workflow instance.
- Workflow transitions can require permission keys, predicates, or both.
- Definitions are versioned so in-flight instances keep their historical semantics.
