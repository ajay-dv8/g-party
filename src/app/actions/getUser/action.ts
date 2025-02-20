 import { supabase } from "@/utils/supabase/auth-client";

 
export const getCurrentUser = async () => {
  try {
    // TODO: Implement and explain rate limiting

    // Validate Supabase client
    if (!supabase) {
      throw new Error('Invalid Supabase client configuration');
    }

    // Get the current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    // console.log("Auth Data:", authData );
    if (authError) {
      console.error("Error getting authenticated user:", authError);
      return null;
    }

    const userId = authData?.user?.id; 
    console.log("User ID:", userId);
    if (!userId) return null;

    // Fetch user details from Supabase table
    const { data: userData, error: userError } = await supabase
      .from("User") // Your Supabase table name
      .select("full_name, email, username, phone, gender")
      .eq("id", userId) // Assuming the ID in your table matches Supabase user ID
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
 













//  "use server"
// import { createClient } from "@supabase/supabase-js";

 
// export const getCurrentUser = async () => { 
//   try { 
//     const supabase = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     );
//         //TODO: Implement rate limiting
        
//         // Validate Supabase client
//         if (!supabase) {
//           throw new Error('Invalid Supabase client configuration');
//         }

//     // Get the current authenticated user
//     const { data } = await supabase.auth.getUser();
//     console.log("Auth Data:", data );
//     if (!data) {
//       console.error("User not authenticated or session expired");
//       return null;
//     }

//     const userId = data?.user?.id; 
//     console.log("User ID:", userId);
//     if(!userId) return null;

//     // Fetch user details from Supabase table
//     const { data: userData, error: userError } = await supabase
//       .from("User") // Your Supabase table name
//       .select("full_name, email, username, phone, gender")
//       .eq("id", userId) // Assuming the ID in your table matches Supabase user ID
//       .single(); // Fetch a single user

//     if (userError) {
//       console.error("Error fetching user from Supabase table:", userError);
//       return null;
//     }

//     return userData;
//   } catch (error) {
//     console.error("Unexpected error fetching user:", error);
//     return null;
//   }
// };
 

 
