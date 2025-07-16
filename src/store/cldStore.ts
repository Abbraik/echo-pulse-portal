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

export interface Layer {
  name: string
  visible: boolean
}

interface PresentState {
  nodes: Node[]
  links: Link[]
  layers: Layer[]
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
  addLayer(name: string): void
  renameLayer(oldName: string, newName: string): void
  setNodeLayer(id: string, layer: string): void
  undo(): void
  redo(): void
}

const initialState: PresentState = {
  nodes: [],
  links: [],
  layers: [{ name: 'Base Loops', visible: true }]
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
          nodes: [...state.present.nodes, node],
          layers: state.present.layers.some((l) => l.name === node.layer)
            ? state.present.layers
            : [...state.present.layers, { name: node.layer, visible: true }]
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
          links: [...state.present.links, link],
          layers: state.present.layers.some((l) => l.name === link.layer)
            ? state.present.layers
            : [...state.present.layers, { name: link.layer, visible: true }]
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
          layers: state.present.layers.map((l) =>
            l.name === name ? { ...l, visible: !l.visible } : l
          )
        },
        future: []
      })),

    addLayer: (name) =>
      set((state) => ({
        past: [...state.past, state.present],
        present: {
          ...state.present,
          layers: state.present.layers.some((l) => l.name === name)
            ? state.present.layers
            : [...state.present.layers, { name, visible: true }]
        },
        future: []
      })),

    renameLayer: (oldName, newName) =>
      set((state) => ({
        past: [...state.past, state.present],
        present: {
          ...state.present,
          layers: state.present.layers.map((l) =>
            l.name === oldName ? { ...l, name: newName } : l
          ),
          nodes: state.present.nodes.map((n) =>
            n.layer === oldName ? { ...n, layer: newName } : n
          ),
          links: state.present.links.map((l) =>
            l.layer === oldName ? { ...l, layer: newName } : l
          )
        },
        future: []
      })),

    setNodeLayer: (id, layer) =>
      set((state) => ({
        past: [...state.past, state.present],
        present: {
          ...state.present,
          nodes: state.present.nodes.map((n) =>
            n.id === id ? { ...n, layer } : n
          ),
          layers: state.present.layers.some((l) => l.name === layer)
            ? state.present.layers
            : [...state.present.layers, { name: layer, visible: true }]
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