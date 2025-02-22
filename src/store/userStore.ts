// stores/userStore.ts
import { create } from 'zustand';
import { getCurrentUser } from "@/app/actions/getUser/action"; 
import { UserData } from '@/types';

interface UserStore {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setUser: (user: UserData | null) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false, 
  error: null,
  
  fetchUser: async () => {
    // Don't fetch if already loading
    if (get().loading) return;
    
    set({ loading: true, error: null });
    try {
    //   console.log('Fetching user data...'); // Debug log
      const userData = await getCurrentUser();
    //   console.log('Received user data:', userData); // Debug log
      set({ user: userData, loading: false });
    } catch (err) {
      console.error('Detailed error fetching user:', err); // Enhanced error logging
      set({ error: 'Failed to load user data', loading: false });
    }
  },

  setUser: (user) => {
    console.log('Setting user:', user); // Debug log
    set({ user });
  },
}));













// //old stores/userStore.ts
// import { create } from 'zustand';
// import { getCurrentUser } from "@/app/actions/getUser/action"; 
// import { UserData } from '@/types';

// interface UserStore {
//   user: UserData | null;
//   loading: boolean;
//   error: string | null;
//   fetchUser: () => Promise<void>;
//   setUser: (user: UserData | null) => void;
// }

// export const useUserStore = create<UserStore>((set) => ({
//   user: null,
//   loading: true,
//   error: null,
  
//   fetchUser: async () => {
//     set({ loading: true, error: null });
//     try {
//       const userData = await getCurrentUser();
//       set({ user: userData, loading: false });
//     } catch (err) {
//       set({ error: 'Failed to load user data', loading: false });
//       console.error('Error loading user:', err);
//     }
//   },

//   setUser: (user) => set({ user }),
// }));