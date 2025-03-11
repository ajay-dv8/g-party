// stores/userStore.ts 
import { getCurrentUser } from "@/app/actions/getUser/action"; 
import { UserData } from '@/types';
import { supabase } from "@/utils/supabase/auth-client"; 
import { create } from "zustand";

interface UserStore {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false, 
  error: null,

  fetchUser: async () => {
    if (get().loading) return;  // Prevent multiple calls

    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.getSession(); // Get session
      if (error || !data?.session?.access_token) {
        set({ user: null, loading: false, error: "No session found" });
        return;
      }

      const accessToken = data.session.access_token;
      const userData = await getCurrentUser(accessToken); 

      if (userData) {
        set({ user: userData, loading: false });
      } else {
        set({ user: null, loading: false, error: "Failed to load user" });
      }
    } catch (err) {
      console.error("Error fetching user:", err);  
      set({ error: "Failed to load user data", loading: false });
    }
  },

  setUser: (user) => set({ user }),

  logout: () => {
    supabase.auth.signOut();  // Sign out user from Supabase
    set({ user: null, error: null });
  },
}));


 