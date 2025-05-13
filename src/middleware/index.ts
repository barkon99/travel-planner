import { defineMiddleware } from 'astro:middleware';

import { supabaseClient } from '../db/supabase.client';

export const onRequest = defineMiddleware((context, next) => {
  context.locals.supabase = supabaseClient;
  
  // Dodajemy testową sesję dla celów deweloperskich
  // W prawdziwej aplikacji, to byłoby ustawiane przez Supabase Auth
  context.locals.session = {
    access_token: 'test-token',
    user: {
      id: 'test-user-id',
      email: 'test@example.com'
    }
  };

  return next();
}); 