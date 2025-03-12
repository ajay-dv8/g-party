
// // // components /comment.tsx
'use client';

import { useUser } from "@/hooks/useUser";
import { Heart, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { addComment } from "@/app/actions/postActions/action";
import { usePostStore } from "@/store/usePostStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatCount, formatTimeElapsed } from "@/utils/util";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Reply } from "@/types";
import { useState } from "react";

interface CommentProps {
  comment: any;
  postId: string;
  parentId?: string; // Parent comment ID for replies
  isReply?: boolean; // Flag to indicate if this is a reply
  depth?: number; // Depth of nesting
}

export function Comment({ comment, postId, parentId, isReply = false, depth = 0 }: CommentProps) {
  const { user } = useUser();
  const {
    toggleCommentLike,
    toggleReplyLike,
    toggleShowReplies,
    toggleReplyInput,
    replyContent,
    setReplyContent,
    addReply
  } = usePostStore();
  
  // Local state for nested replies
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const hasReplies = comment.replies && comment.replies.length > 0;
  const isLiked = comment.likes.some((like: any) => like.userId === user?.id);
  
  // Max nesting depth to prevent excessive nesting
  const MAX_DEPTH = 3; 

  async function handleLike() {
    if (!user) return alert("Please log in to like comments.");
    
    if (isReply) {
      // Handle like for a reply
      toggleReplyLike(postId, parentId!, comment.id, user.id);
    } else {
      // Handle like for a comment
      toggleCommentLike(postId, comment.id, user.id);
    }
  }

  function handleToggleReplyInput() {
    if (!user) return alert("Please log in to reply.");
    
    if (isReply) {
      // For replies, use local state
      setShowReplyInput(!showReplyInput);
    } else {
      // For comments, use store state
      toggleReplyInput(postId, comment.id);
    }
  }

  async function handleReply() {
    if (!user) return alert("Please log in to reply.");
    
    const content = isReply ? replyText : replyContent[comment.id];
    if (!content) return;

    // Temporary reply object (optimistic UI update)
    const tempReply = {
      id: `temp-${Date.now()}`,
      content: content,
      author: {
        id: user.id,
        username: user.username,
      },
      createdAt: new Date().toISOString(),
      likes: [],
      isLiked: false,
      replies: []
    } as Reply;

    // Add to UI instantly
    addReply(postId, parentId || comment.id, tempReply);

    // Send to server
    await addComment(postId, user.id, content, parentId || comment.id);
    
    // Clear input
    if (isReply) {
      setReplyText("");
      setShowReplyInput(false);
    }
  }

  return (
    <div className={`${isReply ? 'ml-2' : 'ml-4'} border-l pl-2 mt-2`}>
      <div className="flex gap-x-2">
        <Avatar className={isReply ? "h-6 w-6" : "h-8 w-8"}>
          <AvatarImage src={comment.author.image} alt="dp" />
          <AvatarFallback className='font-bold'>
            {comment.author.username?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="my-2 w-full">
          <div className="flex flex-col space-y-1">
            <div className="flex items-start gap-2">
              <span className={`font-semibold ${isReply ? 'text-xs' : 'text-sm'}`}>
                {comment.author.username}
              </span>
            </div>

            <p className={`text-gray-700 bg-gray-100 p-2 rounded-lg ${isReply ? 'text-xs' : 'text-sm'}`}>
              {comment.content}
            </p>

            <div className="flex items-center gap-x-4 text-xs justify-between pr-4">
              <div className="flex items-center gap-x-3">
                <span className="text-xs text-gray-400">• {formatTimeElapsed(comment.createdAt)}</span>

                {/* Reply Button (show if not at max depth) */}
                {depth < MAX_DEPTH && (
                  <button
                    onClick={handleToggleReplyInput}
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-x-1"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>Reply</span>
                  </button>
                )}

                {/* Show/Hide Replies */}
                {hasReplies && (
                  <button
                    onClick={() => toggleShowReplies(postId, comment.id)}
                    className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700"
                  >
                    {comment.showReplies ? (
                      <>
                        <ChevronUp className="h-3 w-3" />
                        <span>Hide {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        <span>View {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700"
              >
                {isLiked ? (
                  <Heart className="h-3 w-3 fill-primary text-primary" />
                ) : (
                  <Heart className="h-3 w-3" />
                )}
                <span>{formatCount(comment.likes.length)}</span>
              </button>
            </div>
          </div>

          {/* Reply Input for Comments */}
          {!isReply && comment.showReplyInput && (
            <div className="mt-2">
              <Textarea
                value={replyContent[comment.id] || ""}
                onChange={(e) => setReplyContent(comment.id, e.target.value)}
                placeholder="Write a reply..."
                className="w-full text-sm resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-1">
                <Button size="sm" variant="outline" className="mr-2" onClick={() => toggleReplyInput(postId, comment.id)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleReply}>
                  Reply
                </Button>
              </div>
            </div>
          )}

          {/* Reply Input for Replies */}
          {isReply && showReplyInput && (
            <div className="mt-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full text-xs resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-1">
                <Button size="sm" variant="outline" className="mr-2 text-xs h-7" onClick={() => setShowReplyInput(false)}>
                  Cancel
                </Button>
                <Button size="sm" className="text-xs h-7" onClick={handleReply}>
                  Reply
                </Button>
              </div>
            </div>
          )}

          {/* Display Replies (Nested) */}
          {comment.showReplies && comment.replies.length > 0 && (
            <div className="mt-1 space-y-1">
              {comment.replies.map((reply: any) => (
                <Comment 
                  key={reply.id} 
                  postId={postId} 
                  comment={reply} 
                  parentId={comment.id}
                  isReply={true}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






















// 'use client';

// import { useUser } from "@/hooks/useUser";
// import { Heart, ChevronDown, ChevronUp } from "lucide-react";
// import { addComment } from "@/app/actions/postActions/action";
// import { usePostStore } from "@/store/usePostStore";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { formatCount, formatTimeElapsed } from "@/utils/util";
// import { Textarea } from "./ui/textarea";
// import { Button } from "./ui/button";
// import { Reply } from "@/types";

// interface CommentProps {
//   comment: any;
//   postId: string;
//   parentId?: string; // Parent comment ID for replies
// }

// export function Comment({ comment, postId, parentId }: CommentProps) {
//   const { user } = useUser();
//   const {
//     toggleCommentLike,
//     toggleShowReplies,
//     toggleReplyInput,
//     replyContent,
//     setReplyContent,
//     addReply
//   } = usePostStore();

//   const hasReplies = comment.replies && comment.replies.length > 0;
//   const isLiked = comment.likes.some((like: any) => like.userId === user?.id);

//   async function handleLike() {
//     if (!user) return alert("Please log in to like comments.");
//     toggleCommentLike(postId, comment.id, user.id);
//   }

//   async function handleReply() {
//     if (!user) return alert("Please log in to reply.");
//     if (!replyContent[comment.id]) return;

//     // Temporary reply object (optimistic UI update)
//     const tempReply = {
//       id: `temp-${Date.now()}`,
//       content: replyContent[comment.id],
//       author: {
//         id: user.id,
//         username: user.username,
//       },
//       createdAt: new Date().toISOString(),
//       likes: [],
//       isLiked: false,
//       replies: []
//     } as Reply;

//     // Add to UI instantly
//     addReply(postId, parentId || comment.id, tempReply);

//     // Send to server
//     await addComment(postId, user.id, replyContent[comment.id], parentId || comment.id);
//   }

//   return (
//     <div className="ml-4 border-l pl-2 mt-2">
//       <div className="flex gap-x-2">
//         <Avatar>
//           <AvatarImage src={comment.author.image} alt="dp" />
//           <AvatarFallback className='font-bold'>
//             {comment.author.username?.slice(0, 1).toUpperCase()}
//           </AvatarFallback>
//         </Avatar>

//         <div className="my-2 w-full">
//           <div className="flex flex-col space-y-1">
//             <div className="flex items-start gap-2">
//               <span className="font-semibold text-sm">{comment.author.username}</span>
//             </div>

//             <p className="text-gray-700 bg-gray-100 p-3 rounded-lg">
//               {comment.content}
//             </p>

//             <div className="flex items-center gap-x-4 text-xs justify-between pr-10">
//               <div className="flex items-center gap-x-3">
//                 <span className="text-xs text-gray-400">• {formatTimeElapsed(comment.createdAt)}</span>

//                 {/* Reply Button */}
//                 <button
//                   onClick={() => toggleReplyInput(postId, comment.id)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   Reply
//                 </button>

//                 {/* Show/Hide Replies */}
//                 {hasReplies && (
//                   <button
//                     onClick={() => toggleShowReplies(postId, comment.id)}
//                     className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700"
//                   >
//                     {comment.showReplies ? (
//                       <>
//                         <ChevronUp className="h-3 w-3" />
//                         <span>Hide Replies</span>
//                       </>
//                     ) : (
//                       <>
//                         <ChevronDown className="h-3 w-3" />
//                         <span>View {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}</span>
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>

//               {/* Like Button */}
//               <button
//                 onClick={handleLike}
//                 className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700"
//               >
//                 {isLiked ? (
//                   <Heart className="h-3 w-3 fill-primary text-primary" />
//                 ) : (
//                   <Heart className="h-3 w-3" />
//                 )}
//                 <span>{formatCount(comment.likes.length)}</span>
//               </button>
//             </div>
//           </div>

//           {/* Reply Input */}
//           {comment.showReplyInput && (
//             <div className="mt-2">
//               <Textarea
//                 value={replyContent[comment.id] || ""}
//                 onChange={(e) => setReplyContent(comment.id, e.target.value)}
//                 placeholder="Write a reply..."
//                 className="w-full text-sm resize-none"
//                 rows={2}
//               />
//               <div className="flex justify-end mt-1">
//                 <Button size="sm" variant="outline" className="mr-2" onClick={() => toggleReplyInput(postId, comment.id)}>
//                   Cancel
//                 </Button>
//                 <Button size="sm" onClick={handleReply}>
//                   Reply
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Display Replies (Nested) */}
//           {comment.showReplies && comment.replies.length > 0 && (
//             <div className="mt-2 ml-4 border-l-2 pl-4 space-y-2">
//               {comment.replies.map((reply: any) => (<>
//                 <p> NestedReplies</p>
//                 <Comment 
//                   key={reply.id} 
//                   postId={postId} 
//                   comment={reply} 
//                   parentId={comment.id} 
//                 />
//               </>))}
//             </div>
//           )}


//         </div>
//       </div>
//     </div>
//   );
// }

























// 'use client';

// import { useUser } from "@/hooks/useUser";
// import { Heart, ChevronDown, ChevronUp } from "lucide-react";
// import { addComment } from "@/app/actions/postActions/action";
// import { usePostStore } from "@/store/usePostStore";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { formatCount, formatTimeElapsed } from "@/utils/util";
// import { Textarea } from "./ui/textarea";
// import { Button } from "./ui/button";
// import { Reply } from "@/types";

// interface CommentProps {
//   comment: any;
//   postId: string;
// }

// export function Comment({ comment, postId }: CommentProps) {
//   const { user } = useUser();
//   const {
//     toggleCommentLike,
//     toggleShowReplies,
//     toggleReplyInput,
//     replyContent,
//     setReplyContent,
//     addReply
//   } = usePostStore();

//   const hasReplies = comment.replies && comment.replies.length > 0;
//   const isLiked = comment.likes.some((like: any) => like.userId === user?.id);

//   async function handleLike() {
//     if (!user) return alert("Please log in to like comments.");
//     toggleCommentLike(postId, comment.id, user.id);

//     // Here you would also make a server call to persist the like
//     // We'd need to add a new server action for liking comments
//   }

//   async function handleReply() {
//     if (!user) return alert("Please log in to reply.");
//     if (!replyContent[comment.id]) return;

//     // Add optimistically to store
//     const tempReply = {
//       id: `temp-${Date.now()}`,
//       content: replyContent[comment.id],
//       author: {
//         id: user.id,
//         username: user.username,
//         // image: user.image
//       },
//       createdAt: new Date().toISOString(),
//       likes: [],
//       isLiked: false
//     } as Reply;

//     addReply(postId, comment.id, tempReply);

//     // Send to server - using the same addComment function with parentId
//     const response = await addComment(postId, user.id, replyContent[comment.id], comment.id);

//     // Could update with correct ID from server if needed
//   }

//   return (
//     <div className="ml-4 border-l pl-2 mt-2">
//       <div className="flex gap-x-2">
//         <Avatar>
//           <AvatarImage src={comment.author.image} alt="dp" />
//           <AvatarFallback className='font-bold'>
//             {comment.author.username?.slice(0, 1).toUpperCase()}
//           </AvatarFallback>
//         </Avatar>

//         <div className="my-2 w-full">
//           <div className="flex flex-col space-y-1">
//             <div className="flex items-start gap-2">
//               <span className="font-semibold text-sm">{comment.author.username}</span>
//             </div>

//             <p className="text-gray-700 bg-gray-100 p-3 rounded-lg">
//               {comment.content}
//             </p>

//             <div className="flex items-center gap-x-4 text-xs justify-between pr-10">
//               <div className="flex items-center gap-x-3">
//                 {/* Time */}
//                 <span className="text-xs text-gray-400">• {formatTimeElapsed(comment.createdAt)}</span>

//                 {/* Reply Button */}
//                 <button
//                   onClick={() => toggleReplyInput(postId, comment.id)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   Reply
//                 </button>

//                 {/* Show/Hide Replies */}
//                 {hasReplies && (
//                   <button
//                     onClick={() => toggleShowReplies(postId, comment.id)}
//                     className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700"
//                   >
//                     {comment.showReplies ? (
//                       <>
//                         <ChevronUp className="h-3 w-3" />
//                         <span>Hide Replies</span>
//                       </>
//                     ) : (
//                       <>
//                         <ChevronDown className="h-3 w-3" />
//                         <span>View {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}</span>
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>


//               {/* Like Button */}
//               <button
//                 onClick={handleLike}
//                 className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700"
//               >
//                 {isLiked ? (
//                   <Heart className="h-3 w-3 fill-primary text-primary" />
//                 ) : (
//                   <Heart className="h-3 w-3" />
//                 )}
//                 <span>{formatCount(comment.likes.length)}</span>
//               </button>
//             </div>
//           </div>

//           {/* Reply Input */}
//           {comment.showReplyInput && (
//             <div className="mt-2">
//               <Textarea
//                 value={replyContent[comment.id] || ""}
//                 onChange={(e) => setReplyContent(comment.id, e.target.value)}
//                 placeholder="Write a reply..."
//                 className="w-full text-sm resize-none"
//                 rows={2}
//               />
//               <div className="flex justify-end mt-1">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="mr-2"
//                   onClick={() => toggleReplyInput(postId, comment.id)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={handleReply}
//                 >
//                   Reply
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Display Replies */}
//           {comment.showReplies && comment.replies.length > 0 && (
//             <div className="mt-2 ml-4 border-l-2 pl-4 space-y-2">
//               {comment.replies.map((reply: any) => (
//                 <div key={reply.id} className="flex gap-x-2">
//                   <Avatar className="h-6 w-6">
//                     <AvatarImage src={reply.author.image} alt="dp" />
//                     <AvatarFallback className='font-bold text-xs'>
//                       {reply.author.username?.slice(0, 1).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>

//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <span className="font-semibold text-xs">{reply.author.username}</span>
//                       <span className="text-xs text-gray-500">• {formatTimeElapsed(reply.createdAt)}</span>
//                     </div>

//                     <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">
//                       {reply.content}
//                     </p>

//                     <button
//                       onClick={() => {
//                         // We could add reply liking functionality here
//                       }}
//                       className="flex items-center gap-x-1 text-xs text-gray-500 hover:text-gray-700"
//                     >
//                       {reply.isLiked ? (
//                         <Heart className="h-3 w-3 fill-primary text-primary" />
//                       ) : (
//                         <Heart className="h-3 w-3" />
//                       )}
//                       <span>{formatCount(reply.likes.length)}</span>
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
