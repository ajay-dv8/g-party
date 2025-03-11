// store/usePostStore.ts
import { PostStore } from "@/types";
import { create } from "zustand";

export const usePostStore = create<PostStore>((set) => ({
    posts: [],
    loading: true,
    commentContent: {},
    replyContent: {},
    
    setPosts: (posts) => set({ posts }),
    setLoading: (loading) => set({ loading }),
    
    setCommentContent: (postId, content) => 
      set((state) => ({ 
        commentContent: { ...state.commentContent, [postId]: content } 
      })),
    
    setReplyContent: (commentId, content) => 
      set((state) => ({ 
        replyContent: { ...state.replyContent, [commentId]: content } 
      })),
    
    toggleLike: (postId, userId) => 
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked
                  ? post.likes.filter(like => like.userId !== userId)
                  : [...post.likes, { userId }]
              }
            : post
        )
      })),
    
    toggleCommentLike: (postId, commentId, userId) => 
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        isLiked: !comment.isLiked,
                        likes: comment.isLiked
                          ? comment.likes.filter(like => like.userId !== userId)
                          : [...comment.likes, { userId }]
                      }
                    : comment
                )
              }
            : post
        )
      })),
    
    toggleReplyLike: (postId, commentId, replyId, userId) => 
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        replies: comment.replies.map(reply =>
                          reply.id === replyId
                            ? {
                                ...reply,
                                isLiked: !reply.isLiked,
                                likes: reply.isLiked
                                  ? reply.likes.filter(like => like.userId !== userId)
                                  : [...reply.likes, { userId }]
                              }
                            : reply
                        )
                      }
                    : comment
                )
              }
            : post
        )
      })),
    
    addComment: (postId, comment) => 
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        ),
        commentContent: { ...state.commentContent, [postId]: "" }
      })),
    
    addReply: (postId, commentId, reply) => 
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        replies: [...comment.replies, reply],
                        showReplies: true,
                        showReplyInput: false
                      }
                    : comment
                )
              }
            : post
        ),
        replyContent: { ...state.replyContent, [commentId]: "" }
      })),
    
    toggleShowReplies: (postId, commentId) => 
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? { ...comment, showReplies: !comment.showReplies }
                    : comment
                )
              }
            : post
        )
      })),
    
    toggleReplyInput: (postId, commentId) => 
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? { ...comment, showReplyInput: !comment.showReplyInput }
                    : { ...comment, showReplyInput: false }
                )
              }
            : post
        )
      }))
  }));