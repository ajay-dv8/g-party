// app/api/user/route.js
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; 
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  
    const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        cookies: {
            getAll() {
                return cookieStore.getAll()
              },
              setAll(cookiesToSet) {
                try {
                  cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                  )
                } catch {
                  // The `setAll` method was called from a Server Component.
                  // This can be ignored if you have middleware refreshing
                  // user sessions.
                }
              },
        },
    }
  );
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("full_name, email, username, phone, gender")
    .eq("id", user.id)
    .single();
  
  if (userError) {
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
  
  return NextResponse.json(userData);
}