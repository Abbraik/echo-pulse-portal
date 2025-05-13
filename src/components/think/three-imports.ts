
import * as THREE from 'three';

// Export THREE namespace only
export { THREE };

// We're no longer exporting Vector types directly to avoid type conflicts
// between THREE.Vector3 and @react-three/fiber's Vector3

export default THREE;
