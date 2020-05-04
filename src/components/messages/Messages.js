import React, { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import firebase from "../../firebase";
import { connect } from "react-redux";
import SingleMessage from "./SingleMessage";

export class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
  };
  componentDidMount() {
    const { currentChannel, currentUser } = this.props;

    if (currentChannel && currentUser) {
      let loadedMessages = [];
      this.state.messagesRef
        .child(currentChannel.id)
        .on("child_added", (snapshot) => {
          loadedMessages.push(snapshot.val());
          this.setState({ messages: loadedMessages, messagesLoading: false });
        });
    }
  }
  componentWillUnmount() {
    const { currentChannel } = this.props;
    this.state.messagesRef.child(currentChannel.id).off();
  }
  render() {
    const { messagesRef, messages } = this.state;
    const { currentUser } = this.props;

    return (
      <React.Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">
            {/* MESSAGES */}
            {messages.length > 0 &&
              messages.map((message) => (
                <SingleMessage
                  key={message.timestamp}
                  message={message}
                  user={currentUser}
                />
              ))}
          </Comment.Group>
        </Segment>
        <MessagesForm messagesRef={messagesRef} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(Messages);
