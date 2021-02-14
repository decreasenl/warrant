/**
 * Returned a chunked array in the desired size.
 */
export function _chunk(arr: Array<any>, size: number): Array<Array<any>> {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

/**
 * Set the browser to debug mode.
 */
export function debug(): void {
  window.addEventListener('keydown', function(e){ if(e.key === 'F8') {debugger;} }, false);
}

export function getTarget($event: MouseEvent): HTMLElement {
  return ($event.target as HTMLElement);
}
