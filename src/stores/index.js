import { writable } from "svelte/store"

const INITIAL_FIELDS = {
  title: "",
  description: "",
  status: "Pending",
}

export const activeOrder = writable(INITIAL_FIELDS)
