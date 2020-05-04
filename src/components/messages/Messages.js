import React, { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import firebase from "../../firebase";

export class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
  };
  render() {
    const { messagesRef } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">{/* MESSAGES */}</Comment.Group>
        </Segment>
        <MessagesForm messagesRef={messagesRef} />
      </React.Fragment>
    );
  }
}

export default Messages;
