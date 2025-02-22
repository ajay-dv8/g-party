"use client"; 
import React, { MouseEventHandler } from 'react';
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Camera, ImageIcon, SmilePlus, Plus } from "lucide-react"
import { useUser } from '@/hooks/useUser';

interface PostCreatorProps {
  userName?: string
  avatarUrl?: string
  placeholder?: string
  onPost?: MouseEventHandler<HTMLInputElement>
  onLiveVideo?: () => void
  onPhotoVideo?: () => void
  onFeeling?: () => void
  onCreateStory?: () => void
}

export function PostCreator({
  userName ,
  avatarUrl ,
  placeholder = "What's on your mind",
  onPost,
  onLiveVideo,
  onPhotoVideo,
  onFeeling,
  onCreateStory,
}: PostCreatorProps) {

     
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <img alt={`${userName}'s avatar`} src={avatarUrl || "/placeholder.svg"} className="object-cover" />
          </Avatar>

          <Input
            className="bg-muted/50 border-0 rounded-full"
            placeholder={`${placeholder}, ${userName}?`}
            onClick={onPost}
          />
        </div>
        <Separator className="my-4" />
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

      <div className="p-4">
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

