// hooks/usePost.ts
"use client";
import { fetchPosts } from "@/app/actions/postActions/action"; 
import { usePostStore } from "@/store/usePostStore";
import { useEffect } from "react"; 

export const usePost = () => {
  const {
    posts,
    loading,
    commentContent,
    replyContent,
    setPosts,
    setLoading,
    setCommentContent,
    setReplyContent,
    toggleLike,
    toggleCommentLike,
    toggleReplyLike,
    addComment,
    addReply,
    toggleShowReplies,
    toggleReplyInput
  } = usePostStore();

  // Fetch posts only if not already loaded
  useEffect(() => {
    if (posts.length === 0 && loading) {
      fetchPostData();
    }
  }, [posts, loading]);

  // Function to fetch posts data
  const fetchPostData = async () => {
    try {
      setLoading(true);
      const postsData = await fetchPosts();
      setPosts(postsData as any);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    commentContent,
    replyContent,
    setCommentContent,
    setReplyContent,
    toggleLike,
    toggleCommentLike,
    toggleReplyLike,
    addComment,
    addReply,
    toggleShowReplies,
    toggleReplyInput,
    refreshPosts: fetchPostData
  };
};