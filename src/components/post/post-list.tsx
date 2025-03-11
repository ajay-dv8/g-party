// components/post/post-list.tsx (refactored)
'use client';

import { fetchPosts } from "@/app/actions/postActions/action";
import { usePostStore } from "@/store/usePostStore";
import { useEffect } from "react";  
import { PostItem } from "./post-items";

export default function PostList() {
  const { posts, loading, setPosts, setLoading } = usePostStore();

  useEffect(() => {
    async function loadPosts() {
      const fetchedPosts = await fetchPosts();
      
      // Process posts to add UI state properties
      const processedPosts = fetchedPosts.map(post => ({
        ...post,
        comments: post.comments.map(comment => ({
          ...comment,
          isLiked: false, // We'll update this based on user in the next step
          showReplies: false,
          showReplyInput: false,
          replies: comment.replies.map(reply => ({
            ...reply,
            isLiked: false // Same here
          }))
        }))
      }));
      
      setPosts(processedPosts as any[]);
      setLoading(false);
    }
    
    loadPosts();
  }, [setPosts, setLoading]);

  return (
    <div className="max-w-2xl mx-auto">
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.map((post: any) => <PostItem key={post.id} post={post} />)
      )}
    </div>
  );
}
