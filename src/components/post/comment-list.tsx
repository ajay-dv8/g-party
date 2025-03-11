// components/post/comment-list.tsx
'use client'; 
import { Comment } from "../comment";
 
interface CommentListProps {
  post: any;
}

export function CommentList({ post }: CommentListProps) {
  return (
    <div className="mt-4 p-2">
      {post.comments.map((comment: any) => (
        <Comment key={comment.id} comment={comment} postId={post.id} />
      ))}
    </div>
  );
}
