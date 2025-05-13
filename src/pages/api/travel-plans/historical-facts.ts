import type { APIRoute } from "astro";
import { z } from "zod";
import { supabaseMock } from "../../../lib/mocks/supabase.mock";
import { supabaseClient } from "../../../db/supabase.client";

export const prerender = false;

// Schema dla walidacji parametru ID
const paramsSchema = z.object({
  id: z.string().uuid("Invalid travel plan ID format")
});

/**
 * Endpoint do pobierania faktów historycznych dla konkretnego planu podróży
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

    // 3. Sprawdzamy, czy plan istnieje i czy użytkownik ma do niego dostęp
    const mockedLocals = { ...locals, request };
    const supabase = supabaseMock(mockedLocals);

    // Najpierw sprawdzamy, czy plan istnieje i należy do użytkownika
    const { data: travelPlan, error: travelPlanError } = await supabase
      .from("travel_plans")
      .select("id")
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

    // 4. Pobieramy fakty historyczne dla planu podróży
    // W prawdziwej implementacji, użylibyśmy supabaseClient zamiast mocka
    const { data: historicalFacts, error: factsError } = await supabase
      .from("historical_facts")
      .select("id, place, description, created_at")
      .eq("travel_plan_id", id);

    if (factsError) {
      console.error("Error fetching historical facts:", factsError);
      return new Response(
        JSON.stringify({
          error: "Database Error",
          message: "Failed to fetch historical facts"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5. Zwracamy fakty historyczne
    return new Response(
      JSON.stringify({ data: historicalFacts }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error in historical facts endpoint:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred while fetching historical facts"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}; 