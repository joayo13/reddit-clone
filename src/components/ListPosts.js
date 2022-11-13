/* eslint-disable react/prop-types */
import React from 'react'
import PostCard from './PostCard'

function ListPosts (props) {
  const { subredditPostsData, id } = props
  return (
    <div className='flex flex-col gap-4'>{subredditPostsData.map((post, index) =>
        <PostCard key={index} post={post} index={index} id={id}/>
    )}</div>
  )
}

export default ListPosts
