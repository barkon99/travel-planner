import type { Database } from "./db/database.types";

// Define Tables type to make it easier to reference database tables
type Tables = Database['public']['Tables'];

// ============= Utility Types =============

/** Generic pagination metadata */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/** Generic paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ============= Enums and Constants =============

/** Travel plan type options */
export type TravelType = 'budget' | 'medium' | 'luxury';

/** Generation process status */
export type GenerationStatus = 'pending' | 'completed' | 'failed';

/** Location type options */
export type LocationType = 'attraction' | 'restaurant' | 'activity';

// ============= Authentication DTOs =============

/** Register user request */
export interface RegisterUserDto {
  email: string;
  password: string;
}

/** Register user response */
export interface RegisterUserResponseDto {
  id: string;
  email: string;
  created_at: string;
}

/** Login request */
export interface LoginDto {
  email: string;
  password: string;
}

/** Login response */
export interface LoginResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

// ============= Travel Plan DTOs =============

/** Create travel plan request */
export interface CreateTravelPlanDto {
  destination: string;
  duration_days: number;
  travel_type: TravelType;
  preferences: string[];
  places_to_visit?: string[];
}

/** Travel plan response with generation status */
export interface TravelPlanResponseDto {
  id: string;
  user_id: string;
  destination: string;
  duration_days: number;
  travel_type: string;
  preferences: string[];
  places_to_visit: string[] | null;
  created_at: string;
  updated_at: string;
  generation_status: GenerationStatus;
}

/** Travel plan summary for list views */
export interface TravelPlanSummaryDto {
  id: string;
  destination: string;
  duration_days: number;
  travel_type: string;
  created_at: string;
  updated_at: string;
}

/** Detailed travel plan with all related entities */
export interface DetailedTravelPlanDto extends TravelPlanResponseDto {
  day_plans: DayPlanWithDetailsDto[];
  historical_facts: HistoricalFactDto[];
  user_notes: UserNoteDto[];
  total_estimated_cost: number;
}

// ============= Day Plan DTOs =============

/** Day plan with all related entities */
export interface DayPlanWithDetailsDto {
  id: string;
  travel_plan_id: string;
  day_number: number;
  summary: string;
  created_at: string;
  updated_at: string;
  locations: LocationDto[];
  estimated_costs: EstimatedCostDto;
}

// ============= Location DTOs =============

/** Location details */
export interface LocationDto {
  id: string;
  name: string;
  description: string;
  type: LocationType;
  latitude: number | null;
  longitude: number | null;
  cost: number | null;
  time_needed: number | null;
  day_plan_id: string;
  created_at: string;
  updated_at: string;
}

// ============= Estimated Cost DTOs =============

/** Estimated costs for a day */
export interface EstimatedCostDto {
  accommodation: number;
  transport: number;
  food: number;
  attractions: number;
}

/** Cost breakdown structure */
export interface CostBreakdownDto {
  accommodation: number;
  transport: number;
  food: number;
  attractions: number;
}

/** Daily cost breakdown */
export interface DailyCostBreakdownDto extends CostBreakdownDto {
  day_number: number;
  total: number;
}

/** Total cost estimation for entire trip */
export interface TotalCostEstimationDto {
  total: number;
  breakdown: CostBreakdownDto;
  daily: DailyCostBreakdownDto[];
}

// ============= Historical Facts DTOs =============

/** Historical fact details */
export interface HistoricalFactDto {
  id: string;
  place: string;
  description: string;
  travel_plan_id: string;
  created_at: string;
}

// ============= User Notes DTOs =============

/** Create user note request */
export interface CreateUserNoteDto {
  notes_text: string;
}

/** User note response */
export interface UserNoteDto {
  id: string;
  travel_plan_id: string;
  notes_text: string;
  created_at: string;
}

// ============= AI Generation DTOs =============

/** AI generation status response */
export interface AiGenerationStatusDto {
  status: GenerationStatus;
  message: string;
}

/** Generation status check response */
export interface GenerationStatusCheckDto {
  status: GenerationStatus;
  progress: number;
  estimated_completion_time: string;
}

/** Generation queue item */
export interface GenerationQueueItemDto {
  travel_plan_id: string;
  user_id: string;
  status: GenerationStatus;
  created_at: string;
}

/** Command for travel plan generation service */
export interface GenerateTravelPlanCommand {
  travelPlanId: string;
  userId: string;
  destination: string;
  durationDays: number;
  travelType: string;
  preferences: string[];
  placesToVisit: string[] | null;
}

// ============= Plan Modification DTOs =============

/** Request plan modification */
export interface RequestPlanModificationDto {
  modification_request: string;
}

// ============= AI Response DTOs =============

/** AI response data */
export interface AiResponseDto {
  id: string;
  travel_plan_id: string;
  response_text: string;
  created_at: string;
} 