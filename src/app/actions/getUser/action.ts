 import { supabase } from "@/utils/supabase/auth-client"; 

 
export const getCurrentUser = async () => { 
  try { 
    // TODO: Implement and explain rate limiting
 
    if (!supabase) {
      throw new Error('Invalid Supabase client configuration');
    }

    // Get the current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser(); 
    if (authError) {
      console.error("Error getting authenticated user:", authError);
      return null;
    }

    const userId = authData?.user?.id; 
    if (!userId) return null;

    // Fetch user details from Supabase table
    const { data: userData, error: userError } = await supabase
      .from("User")  
      .select("full_name, email, username, phone, gender")
      .eq("id", userId) 
      .single(); // Fetch a single user

    if (userError) {
      console.error("Error fetching user from Supabase table:", userError);
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Unexpected error fetching user:", error);
    return null;
  }
};
 