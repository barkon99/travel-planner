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

/**
 * Endpoint do pobierania szczegółowego planu podróży
 */
export const GET: APIRoute = async ({ params, request, locals }) => {
  try {
    // 1. Extract the ID from the query parameters since we're no longer using path parameters
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

    // Validate the ID format
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

    // 2. Get authenticated user from middleware
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
    
    // Przekazujemy request do mocka, aby mógł sprawdzić URL
    const mockedLocals = { ...locals, request };
    const supabase = supabaseMock(mockedLocals);

    // 3. Fetch the travel plan and verify ownership
    const travelPlansTable = supabase.from("travel_plans");
    const { data: travelPlan, error: travelPlanError } = await travelPlansTable
      .select()
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (travelPlanError || !travelPlan) {
      return new Response(
        JSON.stringify({
          error: "Not Found",
          message: "Travel plan with specified ID not found"
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Jeśli plan nie został jeszcze wygenerowany, zwróć błąd
    if (travelPlan.generation_status !== "completed") {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: `Travel plan generation is not completed. Current status: ${travelPlan.generation_status}`
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5. Wygeneruj szczegółowy plan podróży - w prawdziwej implementacji byłaby pobierany z bazy
    // Tutaj używamy mocka generatora, aby zwrócić przykładowe dane
    const generateCommand: GenerateTravelPlanCommand = {
      travelPlanId: travelPlan.id,
      userId: travelPlan.user_id,
      destination: travelPlan.destination,
      durationDays: travelPlan.duration_days,
      travelType: travelPlan.travel_type,
      preferences: travelPlan.preferences,
      placesToVisit: travelPlan.places_to_visit
    };
    
    // Generujemy plan na żądanie (w rzeczywistości byłaby zapisany w bazie danych)
    const detailedPlan: DetailedTravelPlanDto = await generateTravelPlan(generateCommand);

    // 6. Zwróć szczegółowy plan podróży
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
    console.error("Unexpected error in travel plan details endpoint:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * Endpoint do usuwania planu podróży
 */
export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Extract the ID from the query parameters
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

    // Validate the ID format
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

    // 2. Get authenticated user from middleware
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

    // 3. W rzeczywistej implementacji, wykonalibyśmy zapytanie do bazy danych
    // aby usunąć plan podróży i powiązane dane
    const { error } = await supabaseClient
      .from("travel_plans")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      // Jeśli plan nie istnieje lub użytkownik nie ma do niego dostępu, 
      // Supabase zwróci błąd, ale nie specyfikuje czy to 404 czy 403
      // Dlatego dla uproszczenia, zawsze zwracamy 404
      return new Response(
        JSON.stringify({
          error: "Not Found",
          message: "Travel plan with specified ID not found or you don't have permission to delete it"
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Zwróć odpowiedź bez zawartości
    return new Response(
      null,
      { status: 204 }
    );
  } catch (error) {
    console.error("Unexpected error in delete travel plan endpoint:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred while deleting the travel plan"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}; 