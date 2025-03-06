"use client"
import React from 'react'
import { PostCreator } from './_components/post-input' 

const Home = () => {
  return (
    <div className="p-4">
    <PostCreator 
      onPost={() => console.log("post clicked ")}
      onLiveVideo={() => console.log("Live video clicked")}
      onPhotoVideo={() => console.log("Photo/video clicked")}
      onFeeling={() => console.log("Feeling clicked")}
      onCreateStory={() => console.log("Create story clicked")}
    /> 
  </div>
  )
}
export default Home