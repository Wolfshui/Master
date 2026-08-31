
export interface RouteDefinition {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  permission: string;
  public?: boolean;
  handlerName: string;
  summary?: string;
}
