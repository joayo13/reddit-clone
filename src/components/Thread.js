import React from 'react'
import Comment from './Comment'

function Thread (props) {
  const { commentMetaData, setReplyToId, postReply, replyToId, commentTextRef } = props
  return (
    commentMetaData.filter((comment) => !comment.replyTo).map((comment, index) =>
            <Comment commentMetaData={commentMetaData} key={index} index={index} comment={comment} setReplyToId={setReplyToId} replyToId={replyToId} commentTextRef={commentTextRef} postReply={postReply}>
            </Comment>)
  )
}

export default Thread
