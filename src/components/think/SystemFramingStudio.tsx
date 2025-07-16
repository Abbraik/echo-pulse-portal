
import React, { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useCLDStore, Node as CLDNodeType, Link as CLDLinkType } from '@/store/cldStore'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Link2, Undo2, Redo2, Layers, LayoutGrid } from 'lucide-react'

const gridSize = 10

function GridHelper({ visible }: { visible: boolean }) {
  const grid = useRef<THREE.GridHelper>(null)
  return visible ? <gridHelper ref={grid} args={[200, 20, '#2dd4bf', '#374151']} /> : null
}

function CLDNode({ node, onSelect }: { node: CLDNodeType; onSelect(id: string): void }) {
  const ref = useRef<THREE.Mesh>(null)
  const moveNode = useCLDStore((s) => s.moveNode)
  const removeNode = useCLDStore((s) => s.removeNode)
  const [drag, setDrag] = useState(false)

  const onPointerDown = (e: any) => {
    e.stopPropagation()
    setDrag(true)
  }
  const onPointerUp = (e: any) => {
    e.stopPropagation()
    setDrag(false)
  }
  const onPointerMove = (e: any) => {
    if (!drag) return
    const p = e.unprojectedPoint
    const x = Math.round(p.x / gridSize) * gridSize
    const y = Math.round(p.y / gridSize) * gridSize
    moveNode(node.id, x, y)
  }

  const onContextMenu = (e: any) => {
    e.stopPropagation()
    removeNode(node.id)
  }

  return (
    <mesh
      ref={ref}
      position={[node.x, node.y, 0]}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onContextMenu={onContextMenu}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(node.id)
      }}
    >
      <boxGeometry args={[8, 4, 0.5]} />
      <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      <Html center>{node.label}</Html>
    </mesh>
  )
}

function CLDLink({ link }: { link: CLDLinkType }) {
  const nodes = useCLDStore((s) => s.present.nodes)
  const from = nodes.find((n) => n.id === link.from)
  const to = nodes.find((n) => n.id === link.to)
  if (!from || !to) return null
  const points = [new THREE.Vector3(from.x, from.y, 0), new THREE.Vector3(to.x, to.y, 0)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
      color: link.type === 'reinforcing' ? '#0ea5e9' : '#f43f5e',
      linewidth: 2 
    }))} />
  )
}

interface SystemFramingStudioProps {
  cldData?: any;
  snaData?: any;
}

const SystemFramingStudio: React.FC<SystemFramingStudioProps> = () => {
  const { nodes, links } = useCLDStore((s) => s.present)
  const addNode = useCLDStore((s) => s.addNode)
  const addLink = useCLDStore((s) => s.addLink)
  const undo = useCLDStore((s) => s.undo)
  const redo = useCLDStore((s) => s.redo)
  const [connectorFrom, setConnectorFrom] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showLayers, setShowLayers] = useState(false)

  const handleAddNode = () => {
    const id = Math.random().toString(36).substring(2, 9)
    addNode({ id, x: 0, y: 0, label: `Node ${nodes.length + 1}`, layer: 'Base Loops' })
  }

  const handleNodeClick = (id: string) => {
    if (connectorFrom) {
      const linkId = Math.random().toString(36).substring(2, 9)
      addLink({ id: linkId, from: connectorFrom, to: id, type: 'reinforcing', layer: 'Base Loops' })
      setConnectorFrom(null)
    } else {
      setConnectorFrom(id)
    }
  }

  return (
    <GlassCard className="relative w-full h-[600px]" variant="deep">
      <div className="absolute top-2 right-2 z-20 flex gap-2">
        <Button size="sm" variant="outline" onClick={handleAddNode} className="glass-panel-deep">
          <Plus size={16} />
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowGrid(!showGrid)}>
          <LayoutGrid size={16} />
        </Button>
        <Button size="sm" variant="outline" onClick={() => setConnectorFrom(null)} className={connectorFrom ? 'bg-teal-800/50' : ''}>
          <Link2 size={16} />
        </Button>
        <Button size="sm" variant="outline" onClick={undo}>
          <Undo2 size={16} />
        </Button>
        <Button size="sm" variant="outline" onClick={redo}>
          <Redo2 size={16} />
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowLayers(!showLayers)}>
          <Layers size={16} />
        </Button>
      </div>
      {showLayers && (
        <div className="absolute top-12 right-2 z-20 glass-panel p-2 text-sm space-y-1">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked readOnly />
            <span>Base Loops</span>
          </div>
        </div>
      )}
      <Canvas orthographic camera={{ position: [100, 100, 100], zoom: 20 }}>
        <ambientLight />
        <group rotation={[-Math.PI / 6, Math.PI / 4, 0]}>
          <GridHelper visible={showGrid} />
          {links.map((l) => (
            <CLDLink key={l.id} link={l} />
          ))}
          {nodes.map((n) => (
            <CLDNode key={n.id} node={n} onSelect={handleNodeClick} />
          ))}
        </group>
        <OrbitControls enableRotate={false} />
      </Canvas>
    </GlassCard>
  )
}

export default SystemFramingStudio;
