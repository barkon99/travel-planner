import type { DetailedTravelPlanDto, DayPlanWithDetailsDto, HistoricalFactDto, LocationDto, EstimatedCostDto, GenerateTravelPlanCommand } from "../../types";

/**
 * Symuluje proces generowania planu podróży
 * W rzeczywistej implementacji byłoby to połączenie z zewnętrznym API AI
 */
export async function generateTravelPlan(command: GenerateTravelPlanCommand): Promise<DetailedTravelPlanDto> {
  // Symulujemy opóźnienie, żeby naśladować rzeczywiste żądanie do AI
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generujemy testowe dane
  const dayPlans = generateMockDayPlans(command.travelPlanId, command.durationDays);
  const historicalFacts = generateMockHistoricalFacts(command.travelPlanId, command.destination);
  
  // Obliczamy sumaryczny koszt
  const totalEstimatedCost = calculateTotalCost(dayPlans);

  // Zwracamy wygenerowany plan podróży
  return {
    id: command.travelPlanId,
    user_id: command.userId,
    destination: command.destination,
    duration_days: command.durationDays,
    travel_type: command.travelType,
    preferences: command.preferences,
    places_to_visit: command.placesToVisit,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    generation_status: "completed",
    day_plans: dayPlans,
    historical_facts: historicalFacts,
    user_notes: [],
    total_estimated_cost: totalEstimatedCost
  };
}

/**
 * Generuje testowe dane dla dziennych planów
 */
function generateMockDayPlans(travelPlanId: string, durationDays: number): DayPlanWithDetailsDto[] {
  const dayPlans: DayPlanWithDetailsDto[] = [];
  
  for (let day = 1; day <= durationDays; day++) {
    // Generujemy lokalizacje dla danego dnia
    const locations = generateMockLocations(crypto.randomUUID(), day);
    
    // Obliczamy koszty dla danego dnia
    const estimatedCosts: EstimatedCostDto = {
      accommodation: Math.floor(Math.random() * 500) + 200,
      transport: Math.floor(Math.random() * 200) + 50,
      food: Math.floor(Math.random() * 300) + 100,
      attractions: Math.floor(Math.random() * 300) + 50
    };
    
    dayPlans.push({
      id: crypto.randomUUID(),
      travel_plan_id: travelPlanId,
      day_number: day,
      summary: `Dzień ${day}: Zwiedzanie głównych atrakcji i odpoczynek wieczorem.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      locations,
      estimated_costs: estimatedCosts
    });
  }
  
  return dayPlans;
}

/**
 * Generuje testowe dane dla lokalizacji
 */
function generateMockLocations(dayPlanId: string, dayNumber: number): LocationDto[] {
  const locationTypes: ("attraction" | "restaurant" | "activity")[] = ["attraction", "restaurant", "activity"];
  const locationsCount = Math.floor(Math.random() * 3) + 3; // 3-5 lokalizacji dziennie
  const locations: LocationDto[] = [];
  
  for (let i = 0; i < locationsCount; i++) {
    const locationType = locationTypes[i % locationTypes.length];
    
    locations.push({
      id: crypto.randomUUID(),
      name: `${locationType.charAt(0).toUpperCase() + locationType.slice(1)} #${dayNumber}-${i+1}`,
      description: `Opis dla ${locationType} #${dayNumber}-${i+1}. To jest przykładowy opis wygenerowany dla celów testowych.`,
      type: locationType,
      latitude: (Math.random() * 180) - 90,
      longitude: (Math.random() * 360) - 180,
      cost: Math.floor(Math.random() * 100) + 10,
      time_needed: Math.floor(Math.random() * 4) + 1, // 1-5 godzin
      day_plan_id: dayPlanId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return locations;
}

/**
 * Generuje testowe fakty historyczne
 */
function generateMockHistoricalFacts(travelPlanId: string, destination: string): HistoricalFactDto[] {
  const factsCount = Math.floor(Math.random() * 3) + 3; // 3-5 faktów
  const facts: HistoricalFactDto[] = [];
  
  for (let i = 0; i < factsCount; i++) {
    facts.push({
      id: crypto.randomUUID(),
      place: `Historyczne miejsce ${i+1} w ${destination}`,
      description: `Interesujący fakt historyczny #${i+1} o miejscu ${destination}. Ten fakt jest generowany automatycznie dla celów testowych.`,
      travel_plan_id: travelPlanId,
      created_at: new Date().toISOString()
    });
  }
  
  return facts;
}

/**
 * Oblicza całkowity koszt na podstawie dziennych kosztów
 */
function calculateTotalCost(dayPlans: DayPlanWithDetailsDto[]): number {
  return dayPlans.reduce((total, day) => {
    const dayCost = day.estimated_costs.accommodation +
                   day.estimated_costs.transport +
                   day.estimated_costs.food +
                   day.estimated_costs.attractions;
    return total + dayCost;
  }, 0);
} 