"use client";
import Image from "next/image";
import { Camera } from "lucide-react";

interface ProfileImageCardProps {
  name: string;
  username: string;
  imageUrl: string;
  onAvatarClick?: () => void;
}

export const ProfileImageCard = ({
  name,
  username,
  imageUrl,
  onAvatarClick,
}: ProfileImageCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-40 w-40">
        {/* Profile Image */}
        <div className="h-full w-full rounded-full border-4 border-primary/10 overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`${name}'s profile picture`}
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Camera Button (Overlapping) */}
        <button
          onClick={onAvatarClick}
          className="absolute bottom-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform ease-in-out duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Camera className="h-5 w-5" />
          <span className="sr-only">Change profile picture</span>
        </button>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold capitalize">{name}</h2>
        <p className="text-primary text-sm">@{username}</p>
      </div>
    </div>
  );
};
