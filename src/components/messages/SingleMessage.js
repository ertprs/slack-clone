import React from "react";
import { Comment } from "semantic-ui-react";
import moment from "moment";

const timeFromNow = (timestamp) => moment(timestamp).fromNow();

const SingleMessage = ({ message, user }) => {
  console.log("message", message);
  console.log("user", user);
  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content
        className={message.user.id === user.uid ? "message__self" : ""}
      >
        <Comment.Author as="a">{message.user.name} </Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        <Comment.Text>{message.content}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default SingleMessage;
