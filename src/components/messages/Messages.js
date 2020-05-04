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
    numUniqueUsers: null,
    searchTerm: "",
    filteredMessages: [],
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
          this.countUsers(loadedMessages);
        });
    }
  }
  componentWillUnmount() {
    const { currentChannel } = this.props;
    this.state.messagesRef.child(currentChannel.id).off();
  }
  countUsers = (loadedMessages) => {
    const uniqueNames = loadedMessages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    this.setState({ numUniqueUsers: uniqueNames.length });
  };
  handleSearchChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  };
  render() {
    const { messagesRef, messages, numUniqueUsers, searchTerm } = this.state;
    const { currentUser, currentChannel } = this.props;
    const newMessages = this.state.messages.filter(
      (message) =>
        message.content &&
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <React.Fragment>
        <MessagesHeader
          messages={messages}
          currentChannel={currentChannel}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm.length > 0
              ? newMessages.map((message) => (
                  <SingleMessage
                    key={message.timestamp}
                    message={message}
                    user={currentUser}
                  />
                ))
              : messages.length > 0 &&
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
