import type { APIRoute } from "astro";
import { z } from "zod";
import { supabaseClient } from "../../../db/supabase.client";
import type { PaginatedResponse, TravelPlanSummaryDto } from "../../../types";

export const prerender = false;

// Schemat walidacji dla parametrów zapytania
const listTravelPlansQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  sort_by: z.enum(["created_at", "updated_at", "destination", "duration_days", "travel_type"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc")
});

/**
 * GET: Lista planów podróży dla zalogowanego użytkownika
 */
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Sprawdzenie autentykacji
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

    // 2. Parsowanie parametrów zapytania
    const url = new URL(request.url);
    const queryParams = {
      page: url.searchParams.get("page") || "1",
      limit: url.searchParams.get("limit") || "10",
      sort_by: url.searchParams.get("sort_by") || "created_at",
      sort_order: url.searchParams.get("sort_order") || "desc"
    };

    const validatedParams = listTravelPlansQuerySchema.parse(queryParams);

    // 3. Obliczanie offsetu dla paginacji
    const offset = (validatedParams.page - 1) * validatedParams.limit;

    // 4. Pobranie danych z bazy (używamy klienta Supabase)
    const { data: travelPlans, error, count } = await supabaseClient
      .from("travel_plans")
      .select("id, destination, duration_days, travel_type, created_at, updated_at", { count: "exact" })
      .eq("user_id", userId)
      .order(validatedParams.sort_by, { ascending: validatedParams.sort_order === "asc" })
      .range(offset, offset + validatedParams.limit - 1);

    if (error) {
      console.error("Error fetching travel plans:", error);
      return new Response(
        JSON.stringify({
          error: "Database Error",
          message: "Failed to fetch travel plans"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5. Przygotowanie odpowiedzi z paginacją
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / validatedParams.limit);

    const response: PaginatedResponse<TravelPlanSummaryDto> = {
      data: travelPlans as TravelPlanSummaryDto[],
      pagination: {
        total: totalItems,
        page: validatedParams.page,
        limit: validatedParams.limit,
        pages: totalPages
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error in list travel plans endpoint:", error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation Error",
          message: "Invalid query parameters",
          details: error.errors
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}; 