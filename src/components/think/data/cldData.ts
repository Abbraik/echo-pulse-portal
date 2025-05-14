
export const mockCldData = {
  nodes: [
    {
      id: "water_supply",
      label: "Water Supply",
      type: "stock",
      value: 72.5,
      color: "#14b8a6",
      subIndicators: [
        { name: "Reservoir Levels", value: 68, unit: "%" },
        { name: "Groundwater Quality", value: 4.2, unit: "" },
        { name: "Precipitation", value: 720, unit: "mm" }
      ]
    },
    {
      id: "population",
      label: "Population",
      type: "stock",
      value: 10.5,
      color: "#3b82f6",
      subIndicators: [
        { name: "Growth Rate", value: 1.2, unit: "%" },
        { name: "Fertility Rate", value: 2.1, unit: "" },
        { name: "Migration Rate", value: 0.4, unit: "%" }
      ]
    },
    {
      id: "agriculture",
      label: "Agriculture",
      type: "variable",
      value: 33.7,
      color: "#a855f7",
      subIndicators: [
        { name: "Land Usage", value: 45, unit: "%" },
        { name: "Crop Yield", value: 3.7, unit: "t/ha" },
        { name: "Water Usage", value: 62, unit: "%" }
      ]
    },
    {
      id: "industry",
      label: "Industry",
      type: "variable",
      value: 27.8,
      color: "#f59e0b",
      subIndicators: [
        { name: "Production Index", value: 112, unit: "" },
        { name: "Water Efficiency", value: 2.8, unit: "m³/$" },
        { name: "Energy Use", value: 34, unit: "%" }
      ]
    }
  ],
  edges: [
    {
      id: "edge1",
      source: "water_supply",
      target: "agriculture",
      type: "reinforcing",
      label: "+",
      strength: 0.8
    },
    {
      id: "edge2",
      source: "agriculture",
      target: "population",
      type: "reinforcing",
      label: "+",
      strength: 0.6
    },
    {
      id: "edge3",
      source: "population",
      target: "water_supply",
      type: "balancing",
      label: "-",
      strength: 0.75
    },
    {
      id: "edge4",
      source: "water_supply",
      target: "industry",
      type: "reinforcing",
      label: "+",
      strength: 0.7
    },
    {
      id: "edge5",
      source: "industry",
      target: "population",
      type: "reinforcing",
      label: "+",
      strength: 0.65
    }
  ]
};
