import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface Node {
  id: string
  x: number
  y: number
  label: string
  layer: string
}

export interface Link {
  id: string
  from: string
  to: string
  type: 'reinforcing' | 'balancing'
  layer: string
}

interface PresentState {
  nodes: Node[]
  links: Link[]
  layers: string[]
}

export interface CLDState {
  past: PresentState[]
  present: PresentState
  future: PresentState[]
  addNode(node: Node): void
  moveNode(id: string, x: number, y: number): void
  removeNode(id: string): void
  addLink(link: Link): void
  removeLink(id: string): void
  toggleLayer(name: string): void
  undo(): void
  redo(): void
}

const initialState: PresentState = {
  nodes: [],
  links: [],
  layers: ['Base Loops']
}

export const useCLDStore = create<CLDState>()(
  immer((set, get) => ({
    past: [],
    present: initialState,
    future: [],
    addNode: (node) =>
      set((state) => {
        state.past.push(state.present)
        state.present = {
          ...state.present,
          nodes: [...state.present.nodes, node]
        }
        state.future = []
      }),
    moveNode: (id, x, y) =>
      set((state) => {
        state.past.push(state.present)
        state.present = {
          ...state.present,
          nodes: state.present.nodes.map((n) =>
            n.id === id ? { ...n, x, y } : n
          )
        }
        state.future = []
      }),
    removeNode: (id) =>
      set((state) => {
        state.past.push(state.present)
        state.present = {
          ...state.present,
          nodes: state.present.nodes.filter((n) => n.id !== id),
          links: state.present.links.filter(
            (l) => l.from !== id && l.to !== id
          )
        }
        state.future = []
      }),
    addLink: (link) =>
      set((state) => {
        state.past.push(state.present)
        state.present = {
          ...state.present,
          links: [...state.present.links, link]
        }
        state.future = []
      }),
    removeLink: (id) =>
      set((state) => {
        state.past.push(state.present)
        state.present = {
          ...state.present,
          links: state.present.links.filter((l) => l.id !== id)
        }
        state.future = []
      }),
    toggleLayer: (name) =>
      set((state) => {
        state.past.push(state.present)
        state.present = {
          ...state.present,
          layers: state.present.layers.includes(name)
            ? state.present.layers.filter((l) => l !== name)
            : [...state.present.layers, name]
        }
        state.future = []
      }),
    undo: () =>
      set((state) => {
        const previous = state.past.pop()
        if (!previous) return
        state.future.unshift(state.present)
        state.present = previous
      }),
    redo: () =>
      set((state) => {
        const next = state.future.shift()
        if (!next) return
        state.past.push(state.present)
        state.present = next
      })
  }))
)