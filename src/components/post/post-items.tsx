// components/post/post-item.tsx
'use client';

import { toggleLike } from "@/app/actions/postActions/action";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, Share } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator"; 
import { usePostStore } from "@/store/usePostStore";
import { formatCount, formatTimeElapsed } from "@/utils/util";
import { CommentsModal } from "./comment-modal";

interface PostItemProps {
  post: any;
}

export function PostItem({ post }: PostItemProps) {
  const { user } = useUser();
  const { toggleLike: storeToggleLike } = usePostStore();

  // Check if the current user has liked this post
  const isLiked = post.likes.some((like: any) => like.userId === user?.id);

  async function handleLike() {
    if (!user) return alert("Please log in to like posts.");
    
    // Update UI immediately
    storeToggleLike(post.id, user.id);
    
    // Send request to server
    await toggleLike(post.id, user.id);
  }

  return (
    <div className="border p-4 mb-4 rounded-lg flex gap-2 md:gap-4">
      <Avatar>
        <AvatarImage src={post.author.image} alt="dp" />
        <AvatarFallback className='font-bold'>
          {post.author.username?.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">@{post.author.username}</h3>
            <span className="text-xs text-gray-500">• {formatTimeElapsed(post.createdAt)}</span>
          </div>
          <p>{post.content}</p>
        </div>

        <div className="flex items-center justify-between gap-2 md:gap-4 mt-3 md:px-8 text-xs">
          {/* Like Count */}
          <div className="flex items-center gap-x-1">
            {isLiked ? (
              <Heart className="h-4 w-4 fill-primary text-primary" />
            ) : (
              <Heart className="h-4 w-4 text-primary/60" />
            )}
            <p className="text-primary/60">{formatCount(post.likes.length)}</p>
          </div>

          {/* Comment count */}
          <div className="">
            <p className="text-xs">{formatCount(post.comments.length)} comments</p>
          </div>
        </div>

        <Separator orientation="horizontal" className="mt-3" />

        {/* Like / Comment / Share Section */}
        <div className="flex items-center justify-between gap-x-2 md:gap-x-4 md:px-8">
          {/* Like Button */}
          <Button
            onClick={handleLike}
            variant={"ghost"}
            className=""
          >
            {isLiked ? (
              <>
                <Heart className="h-4 w-4 fill-primary text-primary" />
                <p className="text-primary/60 text-xs">Unlike</p>
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 text-primary/60" />
                <p className="text-primary/60 text-xs">Like</p>
              </>
            )}
          </Button>

          {/* Comment Button */}
          <CommentsModal post={post} />

          {/* Share Button */}
          <Button
            variant={"ghost"}
            className=""
          >
            <Share className="h-4 w-4 text-primary/60" />
            <p className="text-primary/60">Share</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
