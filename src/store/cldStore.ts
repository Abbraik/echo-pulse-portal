import { create } from 'zustand'

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

export const useCLDStore = create<CLDState>((set, get) => ({
    past: [],
    present: initialState,
    future: [],
    addNode: (node) =>
      set((state) => ({
        past: [...state.past, state.present],
        present: {
          ...state.present,
          nodes: [...state.present.nodes, node]
        },
        future: []
      })),
    moveNode: (id, x, y) =>
      set((state) => ({
        past: [...state.past, state.present],
        present: {
          ...state.present,
          nodes: state.present.nodes.map((n) =>
            n.id === id ? { ...n, x, y } : n
          )
        },
        future: []
      })),
    removeNode: (id) =>
      set((state) => ({
        past: [...state.past, state.present],
        present: {
          ...state.present,
          nodes: state.present.nodes.filter((n) => n.id !== id),
          links: state.present.links.filter(
            (l) => l.from !== id && l.to !== id
          )
        },
        future: []
      })),
    addLink: (link) =>
      set((state) => ({
        past: [...state.past, state.present],
        present: {
          ...state.present,
          links: [...state.present.links, link]
        },
        future: []
      })),
    removeLink: (id) =>
      set((state) => ({
        past: [...state.past, state.present],
        present: {
          ...state.present,
          links: state.present.links.filter((l) => l.id !== id)
        },
        future: []
      })),
    toggleLayer: (name) =>
      set((state) => ({
        past: [...state.past, state.present],
        present: {
          ...state.present,
          layers: state.present.layers.includes(name)
            ? state.present.layers.filter((l) => l !== name)
            : [...state.present.layers, name]
        },
        future: []
      })),
    undo: () =>
      set((state) => {
        const previous = state.past[state.past.length - 1]
        if (!previous) return state
        return {
          past: state.past.slice(0, -1),
          present: previous,
          future: [state.present, ...state.future]
        }
      }),
    redo: () =>
      set((state) => {
        const next = state.future[0]
        if (!next) return state
        return {
          past: [...state.past, state.present],
          present: next,
          future: state.future.slice(1)
        }
      })
  }))