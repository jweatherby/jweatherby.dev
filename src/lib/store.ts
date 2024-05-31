import { writable, type Writable } from "svelte/store";

export type UIStore = {
  popup: {
    id: string | null,
    attrs: Record<string, string>
  }
}

export const ui: Writable<UIStore> = writable({
  popup: {
    id: null,
    attrs: {},
  }
})