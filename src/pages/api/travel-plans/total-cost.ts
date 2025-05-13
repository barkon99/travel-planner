import type { APIRoute } from "astro";
import { z } from "zod";
import { generateTravelPlan } from "../../../lib/services/travelPlanGenerator.service";
import { supabaseMock } from "../../../lib/mocks/supabase.mock";
import type { GenerateTravelPlanCommand, TotalCostEstimationDto, DayPlanWithDetailsDto } from "../../../types";

export const prerender = false;

// Schema dla walidacji parametru ID
const paramsSchema = z.object({
  id: z.string().uuid("Invalid travel plan ID format")
});

/**
 * Endpoint do pobierania całkowitego kosztu planu podróży
 */
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Pobierz ID planu podróży z parametrów zapytania
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Missing travel plan ID parameter"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Walidacja ID planu podróży
    const validatedParams = paramsSchema.safeParse({ id });
    if (!validatedParams.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: validatedParams.error.issues[0].message
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Sprawdzenie autentykacji
    if (!locals.session?.user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Invalid or missing authentication token"
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = locals.session.user.id;

    // 3. Pobieramy dane planu podróży
    const mockedLocals = { ...locals, request };
    const supabase = supabaseMock(mockedLocals);

    const { data: travelPlan, error: travelPlanError } = await supabase
      .from("travel_plans")
      .select()
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (travelPlanError || !travelPlan) {
      return new Response(
        JSON.stringify({
          error: "Not Found",
          message: "Travel plan with specified ID not found or you don't have permission to access it"
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Generujemy szczegółowy plan podróży, aby pobrać dane kosztów
    // W rzeczywistości, te dane byłyby już zapisane w bazie
    const generateCommand: GenerateTravelPlanCommand = {
      travelPlanId: travelPlan.id,
      userId: travelPlan.user_id,
      destination: travelPlan.destination,
      durationDays: travelPlan.duration_days,
      travelType: travelPlan.travel_type,
      preferences: travelPlan.preferences,
      placesToVisit: travelPlan.places_to_visit
    };

    const detailedPlan = await generateTravelPlan(generateCommand);
    const dayPlans = detailedPlan.day_plans;

    // 5. Obliczamy podsumowanie kosztów
    const costEstimation: TotalCostEstimationDto = calculateTotalCostEstimation(dayPlans);

    // 6. Zwracamy podsumowanie kosztów
    return new Response(
      JSON.stringify(costEstimation),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error in total cost endpoint:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred while calculating the total cost"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * Funkcja pomocnicza do obliczania podsumowania kosztów
 */
function calculateTotalCostEstimation(dayPlans: DayPlanWithDetailsDto[]): TotalCostEstimationDto {
  // Inicjalizacja podsumowania kosztów
  const breakdown = {
    accommodation: 0,
    transport: 0,
    food: 0,
    attractions: 0
  };

  // Przygotowanie tablicy dziennych kosztów
  const dailyCosts = dayPlans.map(day => {
    const costs = day.estimated_costs;
    const dayTotal = costs.accommodation + costs.transport + costs.food + costs.attractions;

    // Aktualizacja podsumowania
    breakdown.accommodation += costs.accommodation;
    breakdown.transport += costs.transport;
    breakdown.food += costs.food;
    breakdown.attractions += costs.attractions;

    return {
      day_number: day.day_number,
      total: dayTotal,
      accommodation: costs.accommodation,
      transport: costs.transport,
      food: costs.food,
      attractions: costs.attractions
    };
  });

  // Obliczenie całkowitego kosztu
  const total = breakdown.accommodation + breakdown.transport + breakdown.food + breakdown.attractions;

  return {
    total,
    breakdown,
    daily: dailyCosts
  };
} 