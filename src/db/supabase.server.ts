import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import type { AstroGlobal } from 'astro';

// Define the shape of our locals for type safety
export interface AppLocals {
  session?: {
    access_token: string;
    user: {
      id: string;
      email: string;
    };
  };
}

// For server-side only, used in API routes and server-side rendering
export function supabaseServer(locals: AstroGlobal['locals'] & AppLocals) {
  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;
  
  // Create Supabase client with the service key for admin privileges
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        // If there's an active session, set the Authorization header
        ...(locals.session && {
          Authorization: `Bearer ${locals.session.access_token}`
        })
      }
    }
  });
} 