// signup/route.ts
import { prisma } from "@/lib/prisma"; 
import { createClient } from "@supabase/supabase-js";
 
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
); 
 
export async function POST(req: Request) {
  try {
    console.log('API Route Hit!');
    const body = await req.json();
    console.log('Request Body:', body);

    const { email, password, full_name, username, gender, phone } = body;

    if (!email || !password || !full_name || !username || !gender || !phone) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    } 

    // const prisma = new PrismaClient();
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { phone }
        ]
      }
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          message: existingUser.email === email 
            ? 'Email already in use' 
            : existingUser.username === username
            ? 'Username already taken' 
            : 'Phone number already in use'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sign up with Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
    }); 

    if (authError) {
      return new Response(
        JSON.stringify({ message: authError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Store user data in the database
    const user = await prisma.user.create({
      data: {
        id: authUser.user?.id || '',
        email: authUser.user?.email || '',
        full_name,
        username,
        gender,
        phone,
      },
    }); 

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) { 
    return new Response(
      JSON.stringify({ message: 'Signup failed', error }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
 } 

 