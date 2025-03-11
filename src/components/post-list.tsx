

















// // post-list.tsx
// 'use client';

// import { addComment, fetchPosts, toggleLike } from "@/app/actions/postActions/action";
// import { useUser } from "@/hooks/useUser";
// import { useEffect, useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Heart, MessageCircleMore, Paperclip, Send, Share, Smile } from "lucide-react";
// import { Button } from "./ui/button"; 
// import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "./ui/animated-modal";
// import { Separator } from "./ui/separator";
// import { Textarea } from "./ui/textarea";


// export default function PostList() {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});

//   const { user } = useUser();

//   useEffect(() => {
//     async function loadPosts() {
//       const fetchedPosts = await fetchPosts();
//       setPosts(fetchedPosts);
//       setLoading(false);
//     }
//     loadPosts();
//   }, []);

//   async function handleLike(postId: string) {
//     if (!user) return alert("Please log in to like posts.");
//     const response = await toggleLike(postId, user.id);
//     if (response.success) {
//       setPosts(prevPosts =>
//         prevPosts.map(post =>
//           post.id === postId
//             ? {
//               ...post,
//               likes: response.liked
//                 ? [...post.likes, { userId: user.id }]
//                 : post.likes.filter((l: any) => l.userId !== user.id) // "l" represents each individual like object inside the post.likes array
//             }
//             : post
//         )
//       );
//     }
//   }

//   async function handleComment(postId: string, parentId?: string) {
//     if (!user) return alert("Please log in to comment.");
//     if (!commentContent[postId]) return;

//     const response = await addComment(postId, user?.id, commentContent[postId], parentId);
//     if (response.success) {
//       setPosts(prevPosts =>
//         prevPosts.map(post =>
//           post.id === postId ? { ...post, comments: [...post.comments, response.comment] } : post
//         )
//       );
//       setCommentContent({ ...commentContent, [postId]: "" });
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       {loading ? <p>Loading posts...</p> : (
//         posts.map(post => (
//           <div key={post.id} className="border p-4 mb-4 rounded-lg flex gap-2 md:gap-4">
//             <Avatar>
//               <AvatarImage src={post.author.image} alt="dp" />
//               <AvatarFallback className='font-bold'>
//                 {post.author.username?.slice(0, 1).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>

//             <div className="w-full">

//               <div className="flex flex-col">
//                 <h3 className="font-semibold">@{post.author.username}</h3>
//                 <p>{post.content}</p>
//               </div>

//               <div className="flex items-center justify-between gap-2 md:gap-4 mt-3 md:px-8 text-xs">
//                 {/* Like Button  */}
//                 <div
//                   className="flex items-center gap-x-1"
//                 >
//                   {post.likes.some((like: any) => like.userId === user?.id) ? (
//                     <Heart className="h-4 w-4 fill-primary text-primary" />
//                   ) : (
//                     <Heart className="h-4 w-4 text-primary/60" />)}
//                   <p className="text-primary/60">{post.likes.length}</p>
//                 </div>

//                 {/*comment count  */}
//                 <div className="">
//                   <p className="text-xs ">{post.comments.length} comments</p>
//                 </div>
//               </div>

//               <Separator orientation="horizontal" className="mt-3" />

//               {/* Like / Comment / Share Section */}
//               <div className="flex items-center justify-between gap-x-2 md:gap-x-4 md:px-8 ">
//                 {/* Like Button */}
//                 <Button
//                   onClick={() => handleLike(post.id)}
//                   variant={"ghost"}
//                   className=""
//                 >
//                   {post.likes.some((like: any) => like.userId === user?.id) ? (<>
//                     <Heart className="h-4 w-4 fill-primary text-primary" />
//                     <p className="text-primary/60 text-xs">Unlike</p>
//                   </>) : (<>
//                     <Heart className="h-4 w-4 text-primary/60" />
//                     <p className="text-primary/60 text-xs">Like</p>
//                   </>)}
//                 </Button>

//                 {/* Comment Button/section */}
//                 <Modal> 
//                   <ModalTrigger>
//                     <div className="flex items-center gap-x-1">
//                       <MessageCircleMore className="h-4 w-4 text-primary/60" />
//                       <p className="text-primary/60 text-xs">Comment</p>
//                     </div>
//                   </ModalTrigger>

//                   <ModalBody >
//                     <div className="w-full p-4">
//                       <h3 className="text-lg font-semibold text-center">Comments</h3>
//                     </div>
                    
//                     <ModalContent>
//                       {/* Comment Section */}
//                       <div className=" ">


//                         {/* Display Comments */}
//                         <div className="mt-4">
//                           {post.comments.map((comment: any) => (
//                             <div key={comment.id} className="ml-4 border-l pl-2 mt-2">
//                               <div className="flex gap-x-2">
//                                 <Avatar>
//                                   <AvatarImage src="{user.image}" alt="dp" />
//                                   <AvatarFallback className='font-bold'>
//                                     {user?.username?.slice(0, 1).toUpperCase()}
//                                   </AvatarFallback>
//                                 </Avatar>

//                                 {/* comment and reply comment button */}
//                                 <div className="my-2">
//                                   <p className=" text-gray-700 bg-gray-100 p-3 rounded-lg">
//                                     {comment.content}
//                                   </p>
//                                   <button onClick={() => handleComment(post.id, comment.id)} className="text-xs text-gray-500">Reply</button>
//                                 </div>
//                               </div>

//                               {/* Display Replies */}
//                               {comment.replies.map((reply: any) => (
//                                 <div key={reply.id} className="ml-4 text-sm text-gray-700">
//                                   <p><strong>{reply.author.username}</strong>: {reply.content}</p>
//                                 </div>
//                               ))}
//                             </div>
//                           ))}
//                         </div>

//                         {/* for comment input */}
//                         <ModalFooter className="w-full sticky  bottom-[-1px] bg-white dark:bg-neutral-950">
//                           {/* Input Comment */}
//                           <div className="w-full flex items-center border m-0 p-0 bg-white dark:bg-neutral-950 rounded-full sticky bottom-0">
//                             <div className="flex items-center ml-2">
//                               <Button
//                                 variant={"ghost"}
//                                 size={"sm"}
//                                 className="hover:bg-primary/10 rounded-full p-1 m-0"
//                               >
//                                 <Paperclip />
//                               </Button>

//                               <Button
//                                 variant={"ghost"}
//                                 size={"sm"}
//                                 className="hover:bg-primary/10 rounded-full p-1 m-0"
//                               >
//                                 <Smile />
//                               </Button>
//                             </div>

//                             <Separator orientation="vertical" className="h-4 ml-2 text-xl" />

//                             <Textarea
//                               value={commentContent[post.id] || ""}
//                               onChange={(e) => setCommentContent({ ...commentContent, [post.id]: e.target.value })}
//                               placeholder="Write a comment..."
//                               className="w-full focus-visible:outline-none focus-visible:ring-0 border-none resize-none"
//                               rows={1}
//                             />

//                             <Button
//                               variant={"ghost"}
//                               onClick={() => handleComment(post.id)}
//                               className="hover:bg-primary/10"
//                             >
//                               <Send className="h-4 w-4 text-primary/80 m-0 p-0" />
//                             </Button>
//                           </div>
//                         </ModalFooter>
//                       </div>
//                     </ModalContent>
//                   </ModalBody>
//                 </Modal>

//                 <Button
//                   onClick={() => handleComment(post.id)}
//                   variant={"ghost"}
//                   className=""
//                 >
//                   <Share className="h-4 w-4 text-primary/60" />
//                   <p className="text-primary/60">Share</p>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
