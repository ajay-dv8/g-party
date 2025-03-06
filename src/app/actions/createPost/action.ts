// app/actions/create-post.ts
'use server';

import { prisma } from "@/lib/prisma"; 
import { supabase } from '@/utils/supabase/auth-client';

export async function createPost(postContent: string, accessToken: string) {
  try {
    if (!postContent) {
      return {
        error: "Post cannot be empty",
        success: false
      };
    }

    // Authenticate the user using the access token
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !authData?.user) {
      return {
        error: 'Authentication required',
        success: false
      };
    }

    console.log("Authenticated user:", authData);

    // Create post in the database
    await prisma.post.create({
      data: {
        content: postContent,
        mediaUrls: [],
        authorId: authData.user.id
      }
    });

    return {
      success: true,
      error: null
    };

  } catch (error) {
    console.error('Post creation failed:', error);
    return {
      error: 'Failed to create post. Please try again.',
      success: false
    };
  }
}

 