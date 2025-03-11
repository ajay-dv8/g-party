
// components/post/comments-modal.tsx
'use client';

import { useUser } from "@/hooks/useUser";
import { MessageCircleMore, Paperclip, Send, Smile } from "lucide-react";
import { Button } from "../ui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "../ui/animated-modal";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { CommentList } from "./comment-list";
import { addComment } from "@/app/actions/postActions/action"; 
import { useEffect, useState } from "react";
import { usePostStore } from "@/store/usePostStore";
import { Comment } from "@/types";

interface CommentsModalProps {
  post: any;
}

export function CommentsModal({ post }: CommentsModalProps) {
  const { user } = useUser();
  const { 
    commentContent,
    setCommentContent,
    addComment: storeAddComment
  } = usePostStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  // Custom scrollbar styles
  useEffect(() => {
    if (isOpen && !commentsLoaded) {
      // This is where you would fetch comments if they weren't loaded yet
      setCommentsLoaded(true);
    }
  }, [isOpen, commentsLoaded]);

  async function handleComment() {
    if (!user) return alert("Please log in to comment.");
    if (!commentContent[post.id]) return;

    // Add optimistically to store
    const tempComment = {
      id: `temp-${Date.now()}`,
      content: commentContent[post.id],
      author: {
        id: user.id,
        username: user.username,
        // image: user.image
      },
      createdAt: new Date().toISOString(),
      likes: [],
      replies: [],
      isLiked: false,
      showReplies: false
    } as Comment ;
    
    storeAddComment(post.id, tempComment);
    
    // Send to server
    const response = await addComment(post.id, user.id, commentContent[post.id]);
    
    // Could update with correct ID from server if needed
  }

  return (
    <Modal onOpenChange={setIsOpen}>
      <ModalTrigger>
        <div className="flex items-center gap-x-1">
          <MessageCircleMore className="h-4 w-4 text-primary/60" />
          <p className="text-primary/60 text-xs">Comment</p>
        </div>
      </ModalTrigger>

      <ModalBody>
        <div className="w-full p-4">
          <h3 className="text-lg font-semibold text-center">Comments</h3>
        </div>
        
        <ModalContent className="custom-scrollbar">
          {/* Custom scrollbar styles for comments */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}</style>
          
          {/* Comment List */}
          <CommentList post={post} />

          {/* Comment Input */}
          <ModalFooter className="w-full sticky bottom-[-1px] bg-white dark:bg-neutral-950">
            <div className="w-full flex items-center border m-0 p-0 bg-white dark:bg-neutral-950 rounded-full sticky bottom-0">
              <div className="flex items-center ml-2">
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="hover:bg-primary/10 rounded-full p-1 m-0"
                >
                  <Paperclip />
                </Button>

                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="hover:bg-primary/10 rounded-full p-1 m-0"
                >
                  <Smile />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-4 ml-2 text-xl" />

              <Textarea
                value={commentContent[post.id] || ""}
                onChange={(e) => setCommentContent(post.id, e.target.value)}
                placeholder="Write a comment..."
                className="w-full focus-visible:outline-none focus-visible:ring-0 border-none resize-none"
                rows={1}
              />

              <Button
                variant={"ghost"}
                onClick={handleComment}
                className="hover:bg-primary/10"
              >
                <Send className="h-4 w-4 text-primary/80 m-0 p-0" />
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
