
export interface WorkflowState {
  id: string;
  key: string;
  title: string;
  description?: string;
  isInitial?: boolean;
  isTerminal?: boolean;
}

export interface WorkflowTransition {
  id: string;
  fromStateKey: string;
  toStateKey: string;
  eventName: string;
  permissionKey?: string;
  conditionExpression?: string;
}

export interface WorkflowDefinition {
  id: string;
  installationId: string;
  key: string;
  version: number;
  title: string;
  description?: string;
  states: readonly WorkflowState[];
  transitions: readonly WorkflowTransition[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowInstance {
  id: string;
  installationId: string;
  definitionId: string;
  currentStateKey: string;
  subjectType: string;
  subjectId: string;
  context: Record<string, string | number | boolean | null>;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}
