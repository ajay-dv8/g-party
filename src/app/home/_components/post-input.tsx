"use client";
import React, { MouseEventHandler, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button" 
import { Separator } from "@/components/ui/separator"
import { Camera, ImageIcon, SmilePlus, Plus } from "lucide-react"
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';

interface PostCreatorProps {
  avatarUrl?: string
  placeholder?: string
  onPost?: MouseEventHandler<HTMLInputElement>
  onLiveVideo?: () => void
  onPhotoVideo?: () => void
  onFeeling?: () => void
  onCreateStory?: () => void
}

export function PostCreator({ 
  onPost,
  onLiveVideo,
  onPhotoVideo,
  onFeeling,
  onCreateStory,
}: PostCreatorProps) { 

  return (
    <div className="w-full max-w-2xl mx-auto space-y-1">
      <div className="p-4 border rounded-md">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <Image src="https://github.com/shadcn.png" alt="dp" width={50} height={50} />
          </Avatar>

          <CreatePostModal />
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-3 gap-2">
          <Button variant="ghost" className="flex items-center gap-2" onClick={onLiveVideo}>
            <Camera className="w-5 h-5 text-rose-500" />
            <span className="hidden sm:inline">Live video</span>
          </Button>

          <Button variant="ghost" className="flex items-center gap-2" onClick={onPhotoVideo}>
            <ImageIcon className="w-5 h-5 text-green-500" />
            <span className="hidden sm:inline">Photo/video</span>
          </Button>

          <Button variant="ghost" className="flex items-center gap-2" onClick={onFeeling}>
            <SmilePlus className="w-5 h-5 text-yellow-500" />
            <span className="hidden sm:inline">Feeling/activity</span>
          </Button>
        </div>
      </div>

      <div className="px-4">
        <Button variant="ghost" className="w-full flex items-center gap-3 justify-start" onClick={onCreateStory}>
          <div className="bg-primary/10 p-2 rounded-full">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Create story</div>
            <div className="text-sm text-muted-foreground">Share a photo or write something</div>
          </div>
        </Button>
      </div>
    </div>
  )
}






 

import { useFormStatus } from 'react-dom';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from '@/components/ui/animated-modal';
import { Textarea } from '@/components/ui/textarea'; 
import { createPost } from '@/app/actions/createPost/action'; 
import { supabase } from '@/utils/supabase/auth-client';

export function CreatePostModal() { 

  const { user } = useUser();
  const { pending } = useFormStatus();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Custom function to handle form submission
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Get the post content
    const formData = new FormData(event.currentTarget);
    const postContent = formData.get("post");

    // Get user access token from Supabase
    const { data: session } = await supabase.auth.getSession();
    const accessToken = session?.session?.access_token;

    if (!accessToken) {
      setError("Authentication required. Please log in.");
      return;
    }

    // Call server action with the post content and token
    const response = await createPost(postContent as string, accessToken);
    
    if (response.success) {
      setSuccess(true);
      setError(null);
      console.log("Post created successfully");
    } else {
      setError(response.error || "Failed to create post.");
    }
  }


  return (
    <div className="w-full flex items-center justify-center">
      <Modal>
        <ModalTrigger className="w-full text-start cursor-pointer font-normal text-gray-400"> 
          <p className="w-full text-start"> {`What's on your mind ?, ${user?.username || 'User'}...`} </p>
        </ModalTrigger>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <ModalContent>
              <h4 className="text-lg md:text-2xl text-neutral-800 dark:text-neutral-100 font-bold text-center mb-4 border-b border-primary/20 pb-4">
                Create post
              </h4>

                <div className="px-4 flex items-center gap-x-3">
                  <Avatar>
                   <AvatarImage src="{user.image}" alt="dp" />
                   <AvatarFallback className='font-bold'>
                     {user?.username?.slice(0, 1).toUpperCase()}
                   </AvatarFallback>
                 </Avatar>
                 <div className="flex flex-col">
                   <p className="font-semibold capitalize">{user?.full_name}</p>
                   <p className="text-sm text-muted-foreground">@{user?.username}</p>
                 </div>
                </div>

              <div className="py-6 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start w-full mx-auto">
                <Textarea
                  name="post"
                  className="text-xl min-h-[80px] resize-none rounded-xl w-full placeholder:text-xl focus-visible:outline-none focus-visible:ring-0 border-none"
                  rows={6}
                  placeholder={`What's on your mind, ${user?.username || 'User'}?`}
                  required
                />
                {/* {state?.error && (
                  <p className="text-red-500 text-sm">{state.error}</p>
                )} */}
              </div>

              <div className="flex items-center justify-between">
                <p className="">Add to your post</p>
                <div className="flex items-center gap-x-2">
                  <button type="button" className="flex items-center gap-x-2">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-sm">Image</span>
                  </button>
                  <button type="button" className="flex items-center gap-x-2">
                    <Camera className="w-6 h-6" />
                    <span className="text-sm">Video</span>
                  </button>
                  <button type="button" className="flex items-center gap-x-2">
                    <SmilePlus className="w-6 h-6" />
                    <span className="text-sm">Feeling/Activity</span>
                  </button>
                </div>
              </div>
            </ModalContent>

            <ModalFooter className="gap-4">
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? 'Posting...' : 'Post'}
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}


 