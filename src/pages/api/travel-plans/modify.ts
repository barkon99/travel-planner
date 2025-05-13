import type { APIRoute } from "astro";
import { z } from "zod";
import { generateTravelPlan } from "../../../lib/services/travelPlanGenerator.service";
import { supabaseMock } from "../../../lib/mocks/supabase.mock";
import { supabaseClient } from "../../../db/supabase.client";
import type { GenerateTravelPlanCommand, DetailedTravelPlanDto } from "../../../types";

export const prerender = false;

// Schema for validating UUID path parameter
const paramsSchema = z.object({
  id: z.string().uuid("Invalid travel plan ID format")
});

// Schemat walidacji dla żądania modyfikacji
const modificationSchema = z.object({
  modification_request: z.string().min(5, "Modification request must be at least 5 characters long").max(500, "Modification request cannot exceed 500 characters")
});

/**
 * Endpoint do zażądania modyfikacji istniejącego planu podróży
 */
export const POST: APIRoute = async ({ request, locals }) => {
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

    // 3. Parsuj i waliduj dane żądania
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

    const validationResult = modificationSchema.safeParse(requestData);
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

    const { modification_request } = validationResult.data;

    // 4. Sprawdź, czy plan istnieje i czy użytkownik ma do niego dostęp
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
          message: "Travel plan with specified ID not found or you don't have permission to modify it"
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5. W prawdziwej implementacji, tutaj umieścilibyśmy prośbę o modyfikację w kolejce
    // i zwrócili status "pending". Dla uproszczenia, od razu generujemy zmodyfikowany plan.
    console.log(`Modifying travel plan ${id} with request: ${modification_request}`);

    // 6. Generowanie zmodyfikowanego planu
    const generateCommand: GenerateTravelPlanCommand = {
      travelPlanId: travelPlan.id,
      userId: travelPlan.user_id,
      destination: travelPlan.destination,
      durationDays: travelPlan.duration_days,
      travelType: travelPlan.travel_type,
      preferences: [...travelPlan.preferences, modification_request], // Dodajemy żądanie modyfikacji jako preferencję
      placesToVisit: travelPlan.places_to_visit
    };

    // W prawdziwej aplikacji tutaj byłaby logika współpracy z AI do modyfikacji planu
    await generateTravelPlan(generateCommand); // Generujemy plan, ale nie używamy go tutaj

    // 7. Zwróć odpowiedź
    return new Response(
      JSON.stringify({
        status: "completed",
        message: "Travel plan modification has been processed successfully"
      }),
      { 
        status: 202, 
        headers: { "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Unexpected error in travel plan modification endpoint:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred while processing the modification request"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}; 