export type UserData = {
  id: string;
    full_name: string | null;
    email: string | null;
    username: string | null;
    phone: string | null;
    gender: string | null;
    avatar_url?: string | null;
  } | null;




   
export interface Author {
  id: string;
  username: string;
  image?: string;
}

export interface Reply {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: Like[];
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likes: Like[];
  replies: Reply[];
  isLiked?: boolean;
  showReplies?: boolean;
  showReplyInput?: boolean;
}

export interface Like {
  userId: string;
}

export interface Post {
  id: string;
  content: string;
  author: Author;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
  isLiked?: boolean;
}


// export interface PostStore {
//   posts: Post[];
//   loading: boolean;
//   commentContent: Record<string, string>;
//   replyContent: Record<string, string>;
//   nestedReplyContent: Record<string, string>;
  
//   setPosts: (posts: Post[]) => void;
//   setLoading: (loading: boolean) => void;
//   setCommentContent: (postId: string, content: string) => void;
//   setReplyContent: (commentId: string, content: string) => void;
//   setNestedReplyContent: (replyId: string, content: string) => void;
  
//   addComment: (postId: string, comment: Comment) => void;
//   addReply: (postId: string, commentId: string, reply: Reply) => void;
//   addNestedReply: (postId: string, commentId: string, replyId: string, nestedReply: any) => void;
  
//   togglePostLike: (postId: string, userId: string) => void;
//   toggleCommentLike: (postId: string, commentId: string, userId: string) => void;
//   toggleReplyLike: (postId: string, commentId: string, replyId: string, userId: string) => void;
  
//   toggleShowReplies: (postId: string, commentId: string) => void;
//   toggleReplyInput: (postId: string, commentId: string) => void;
//   toggleNestedReplyInput: (postId: string, commentId: string, replyId: string) => void;
// }

export interface PostStore {
  posts: Post[];
  // posts: any[];
  loading: boolean;
  commentContent: Record<string, string>;
  replyContent: Record<string, string>;
  
  // Actions
  setPosts: (posts: Post[]) => void;
  setLoading: (loading: boolean) => void;
  setCommentContent: (postId: string, content: string) => void;
  setReplyContent: (commentId: string, content: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  toggleCommentLike: (postId: string, commentId: string, userId: string) => void;
  toggleReplyLike: (postId: string, commentId: string, replyId: string, userId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  addReply: (postId: string, commentId: string, reply: Reply) => void;
  toggleShowReplies: (postId: string, commentId: string) => void;
  toggleReplyInput: (postId: string, commentId: string) => void;
}