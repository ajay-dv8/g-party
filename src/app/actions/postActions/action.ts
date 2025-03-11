// actions/postActions/action.ts
'use server';

import { prisma } from "@/lib/prisma";

// ✅ Fetch all posts with comments & likes
export async function fetchPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, username: true },
        },
        likes: true,
        comments: {
          include: {
            author: { select: { id: true, username: true } },
            likes: true,
            replies: {
              include: { 
                author: { select: { id: true, username: true } },
                likes: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!posts) throw new Error("No posts found or database returned null.");
    
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Return empty array to prevent crashes
  }
}

// ✅ Like or Unlike a Post
export async function toggleLike(postId: string, userId: string) {
  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return { 
        success: true, 
        liked: false 
      };
    } else {
      await prisma.like.create({ data: { postId, userId } });
      return { 
        success: true, 
        liked: true 
      };
    }
  } catch (error) {
    console.error("Error liking post:", error);
    return { success: false };
  }
}

// 🆕 Like or Unlike a Comment
export async function toggleCommentLike(commentId: string, userId: string) {
  try {
    const existingLike = await prisma.like.findFirst({
      where: { commentId, userId }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return { 
        success: true, 
        liked: false 
      };
    } else {
      await prisma.like.create({ data: { commentId, userId } });
      return { 
        success: true, 
        liked: true 
      };
    }
  } catch (error) {
    console.error("Error liking comment:", error);
    return { success: false };
  }
}

// ✅ Add a Comment or Reply (enhanced)
export async function addComment(postId: string, userId: string, content: string, parentId?: string) {
  try {
    const newComment = await prisma.comment.create({
      data: { postId, authorId: userId, content, parentId },
      include: {
        author: { select: { id: true, username: true } },
        likes: true,
        replies: {
          include: {
            author: { select: { id: true, username: true } },
            likes: true
          }
        }
      }
    }); 

    return { success: true, comment: newComment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false };
  }
}


















// // actions/postActions/action.ts
// 'use server';

// import { prisma } from "@/lib/prisma"; 

// // ✅ Fetch all posts with comments & likes
// export async function fetchPosts() {
//   try {
//     const posts = await prisma.post.findMany({
//       include: {
//         author: {
//           select: { id: true, username: true }, // Ensure username is fetched
//         },
//         likes: true,
//         comments: {
//           include: {
//             author: { select: { id: true, username: true } },
//             replies: {
//               include: { author: { select: { id: true, username: true } } } // Ensure author is properly selected
//             }
//           }
//         }
//       },
//       orderBy: { createdAt: 'desc' }
//     });

//     console.log("Fetched Posts:", JSON.stringify(posts, null, 2));

//     if (!posts) throw new Error("No posts found or database returned null.");
    
//     return posts;
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return []; // Return empty array to prevent crashes
//   }
// }


// // ✅ Like or Unlike a Post
// export async function toggleLike(postId: string, userId: string) {
//   try {
//     const existingLike = await prisma.like.findFirst({
//       where: { postId, userId }
//     });

//     if (existingLike) {
//       await prisma.like.delete({ where: { id: existingLike.id } });
//       return { 
//         success: true, 
//         liked: false 
//       };
//     } else {
//       await prisma.like.create({ data: { postId, userId } });
//       return { 
//         success: true, 
//         liked: true 
//       };
//     }
//   } catch (error) {
//     console.error("Error liking post:", error);
//     return { success: false };
//   }
// }

// // ✅ Add a Comment or Reply
// export async function addComment(postId: string, userId: string, content: string, parentId?: string) {
//   try {
//     const newComment = await prisma.comment.create({
//       data: { postId, authorId: userId, content, parentId }
//     });

//     return { success: true, comment: newComment };
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     return { success: false };
//   }
// }
