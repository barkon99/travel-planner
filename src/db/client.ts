import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Helper functions for common database operations

/**
 * Get all travel plans for the current user
 */
export async function getUserTravelPlans() {
  const { data, error } = await supabase
    .from('travel_plans')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching travel plans:', error)
    throw error
  }
  
  return data
}

/**
 * Get a complete travel plan with all related data
 */
export async function getCompleteTravelPlan(travelPlanId: string) {
  const { data, error } = await supabase
    .rpc('get_complete_travel_plan', { travel_plan_id: travelPlanId })
  
  if (error) {
    console.error('Error fetching complete travel plan:', error)
    throw error
  }
  
  return data
}

/**
 * Create a new travel plan
 */
export async function createTravelPlan(
  destination: string,
  durationDays: number,
  travelType: 'budget' | 'medium' | 'luxury',
  preferences: string[],
  placesToVisit?: string[]
) {
  const { data, error } = await supabase
    .from('travel_plans')
    .insert({
      destination,
      duration_days: durationDays,
      travel_type: travelType,
      preferences,
      places_to_visit: placesToVisit,
      user_id: (await supabase.auth.getUser()).data.user?.id || ''
    })
    .select()
  
  if (error) {
    console.error('Error creating travel plan:', error)
    throw error
  }
  
  // Log the event
  await logUserEvent('plan_creation')
  
  return data[0]
}

/**
 * Add a day plan to a travel plan
 */
export async function addDayPlan(
  travelPlanId: string,
  dayNumber: number,
  summary: string
) {
  const { data, error } = await supabase
    .from('day_plans')
    .insert({
      travel_plan_id: travelPlanId,
      day_number: dayNumber,
      summary
    })
    .select()
  
  if (error) {
    console.error('Error adding day plan:', error)
    throw error
  }
  
  return data[0]
}

/**
 * Add a location to a day plan
 */
export async function addLocation(
  dayPlanId: string,
  name: string,
  description: string,
  type: 'attraction' | 'restaurant' | 'activity',
  cost?: number,
  timeNeeded?: number,
  latitude?: number,
  longitude?: number
) {
  const { data, error } = await supabase
    .from('locations')
    .insert({
      day_plan_id: dayPlanId,
      name,
      description,
      type,
      cost,
      time_needed: timeNeeded,
      latitude,
      longitude
    })
    .select()
  
  if (error) {
    console.error('Error adding location:', error)
    throw error
  }
  
  return data[0]
}

/**
 * Add estimated costs to a day plan
 */
export async function addEstimatedCosts(
  dayPlanId: string,
  accommodation: number,
  transport: number,
  food: number,
  attractions: number
) {
  const { data, error } = await supabase
    .from('estimated_costs')
    .insert({
      day_plan_id: dayPlanId,
      accommodation,
      transport,
      food,
      attractions
    })
    .select()
  
  if (error) {
    console.error('Error adding estimated costs:', error)
    throw error
  }
  
  return data[0]
}

/**
 * Add a historical fact to a travel plan
 */
export async function addHistoricalFact(
  travelPlanId: string,
  place: string,
  description: string
) {
  const { data, error } = await supabase
    .rpc('add_historical_fact', {
      p_travel_plan_id: travelPlanId,
      p_place: place,
      p_description: description
    })
  
  if (error) {
    console.error('Error adding historical fact:', error)
    throw error
  }
  
  return data
}

/**
 * Add a user note to a travel plan
 */
export async function addUserNote(
  travelPlanId: string,
  notesText: string
) {
  const { data, error } = await supabase
    .from('user_notes')
    .insert({
      travel_plan_id: travelPlanId,
      notes_text: notesText
    })
    .select()
  
  if (error) {
    console.error('Error adding user note:', error)
    throw error
  }
  
  return data[0]
}

/**
 * Add an AI response to a travel plan
 */
export async function addAIResponse(
  travelPlanId: string,
  responseText: string
) {
  const { data, error } = await supabase
    .from('ai_responses')
    .insert({
      travel_plan_id: travelPlanId,
      response_text: responseText
    })
    .select()
  
  if (error) {
    console.error('Error adding AI response:', error)
    throw error
  }
  
  return data[0]
}

/**
 * Log a user event
 */
export async function logUserEvent(
  eventType: 'registration' | 'login' | 'profile_update' | 'plan_creation' | 'plan_edit'
) {
  const { data, error } = await supabase
    .rpc('log_user_event', {
      p_event_type: eventType
    })
  
  if (error) {
    console.error('Error logging user event:', error)
    throw error
  }
  
  return data
} 