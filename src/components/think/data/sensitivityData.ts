
export const mockSensitivityData = {
  parameters: [
    { parameter: "Water Tariff", impact: 34, direction: "positive" as const, node: "water_supply" },
    { parameter: "Migration Policy", impact: 28, direction: "negative" as const, node: "population" },
    { parameter: "Educational Investment", impact: 25, direction: "positive" as const, node: "social" },
    { parameter: "Energy Subsidies", impact: 22, direction: "negative" as const, node: "industry" },
    { parameter: "Healthcare Access", impact: 20, direction: "positive" as const, node: "social" },
    { parameter: "Housing Density", impact: 18, direction: "negative" as const, node: "population" },
    { parameter: "Carbon Tax", impact: 16, direction: "positive" as const, node: "industry" },
    { parameter: "Food Imports", impact: 15, direction: "negative" as const, node: "agriculture" }
  ],
  leveragePoints: [
    { name: "Parameters", potential: 34 },
    { name: "Feedback Loops", potential: 28 },
    { name: "Information Flows", potential: 22 }
  ]
};
