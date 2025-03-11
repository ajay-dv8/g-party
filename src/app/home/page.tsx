"use client"
import React from 'react'
import { PostCreator } from './_components/post-input' 
import PostList from '@/components/post/post-list'
// import PostList from '@/components/post-list'

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

    <PostList />
  </div>
  )
}
export default Home