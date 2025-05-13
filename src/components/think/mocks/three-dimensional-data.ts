
// Mock CLD (Causal Loop Diagram) data for 3D visualization
export const mockCLDData = {
  stocks: [
    { id: "population", position: [0, 0, 0], value: 80 },
    { id: "resources", position: [4, 0, 0], value: 72 },
    { id: "goods", position: [0, 4, 0], value: 68 },
    { id: "social", position: [4, 4, 0], value: 85 }
  ],
  loops: [
    { from: "population", to: "resources", type: "reinforcing" },
    { from: "resources", to: "goods", type: "reinforcing" },
    { from: "goods", to: "social", type: "reinforcing" },
    { from: "social", to: "population", type: "balancing" }
  ]
};

// Mock SNA (Social Network Analysis) data for 3D visualization
export const mockSNAData = {
  actors: [
    { id: "Gov", type: "government", weight: 0.8, links: ["population", "resources"], position: [2, 2, 1.5] },
    { id: "Corp", type: "private", weight: 0.6, links: ["resources", "goods"], position: [3, 1, 1.5] }
  ]
};
