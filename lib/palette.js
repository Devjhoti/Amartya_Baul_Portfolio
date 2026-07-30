/**
 * The palette is raised by an event rather than by lifted state, so any
 * trigger anywhere in the tree can open it without a provider. Kept in its
 * own module so a button can import the opener without pulling the whole
 * dialog into its chunk.
 */
export const PALETTE_EVENT = "ab:palette";

export function openPalette() {
  window.dispatchEvent(new Event(PALETTE_EVENT));
}
