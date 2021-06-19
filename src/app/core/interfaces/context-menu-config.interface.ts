export interface ContextMenuConfig {
  top: number;
  left: number;
  zIndex?: number;
  options: Array<ContextMenuAction>;
}

export interface ContextMenuAction {
    label: string;
    method: Function;
    visible?: boolean;
}
