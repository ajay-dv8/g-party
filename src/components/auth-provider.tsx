"use client";  // ⬅️ This makes it a Client Component

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export default function AuthProvider() {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();  // Fetch user on app load
  }, []);

  return null; // This component only handles authentication logic
}
