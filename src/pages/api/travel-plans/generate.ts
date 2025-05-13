import type { APIRoute } from "astro";
import { z } from "zod";
import { generateTravelPlan } from "../../../lib/services/travelPlanGenerator.service";
import type { DetailedTravelPlanDto, GenerateTravelPlanCommand } from "../../../types";

export const prerender = false;

// Schemat walidacji dla danych wejściowych
const generateSchema = z.object({
  destination: z.string().min(2, "Destination must be at least 2 characters long"),
  duration_days: z.number().int().min(1, "Duration must be at least 1 day").max(30, "Duration cannot exceed 30 days"),
  travel_type: z.enum(["budget", "medium", "luxury"] as const),
  preferences: z.array(z.string()).min(1, "At least one preference is required"),
  places_to_visit: z.array(z.string()).optional().nullable()
});

/**
 * Endpoint do bezpośredniego generowania planu podróży na podstawie parametrów od użytkownika
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Sprawdź autentykację użytkownika
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
    
    // 2. Parsuj i waliduj dane wejściowe
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Invalid JSON in request body"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const validationResult = generateSchema.safeParse(requestData);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation Error",
          message: "Invalid input data",
          details: validationResult.error.errors
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const validatedData = validationResult.data;
    
    // 3. Przygotuj obiekt komendy dla generatora
    const travelPlanId = crypto.randomUUID(); // Generujemy nowe ID dla planu
    
    const generateCommand: GenerateTravelPlanCommand = {
      travelPlanId,
      userId,
      destination: validatedData.destination,
      durationDays: validatedData.duration_days,
      travelType: validatedData.travel_type,
      preferences: validatedData.preferences,
      placesToVisit: validatedData.places_to_visit ?? null
    };
    
    // 4. Generuj plan podróży bezpośrednio
    const detailedPlan: DetailedTravelPlanDto = await generateTravelPlan(generateCommand);
    
    // 5. Zwróć wygenerowany plan
    return new Response(
      JSON.stringify(detailedPlan),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate" 
        } 
      }
    );
    
  } catch (error) {
    console.error("Error generating travel plan:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred while generating the travel plan"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}; 