export function calculateEnergyConsumption(watts: number, hours: number): number {
  return (watts * hours) / 1000;
}

export function calculateEnergyCost(kwh: number, kwhCost: number): number {
  return kwh * kwhCost;
}

export function calculateFilamentCost(filamentCost: number, usedGrams: number): number {
  return (filamentCost / 1000) * usedGrams;
}

export function calculateTotalCost(energyCost: number, filamentCost: number): number {
  return energyCost + filamentCost;
}

