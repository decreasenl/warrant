export interface ContextMenuConfig {
  top: number,
  left: number,
  options: Array<ContextMenuAction>
}

export interface ContextMenuAction {
    label: string,
    method: Function,
    type: string
}