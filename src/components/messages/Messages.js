import React, { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import firebase from "../../firebase";
import { connect } from "react-redux";
import SingleMessage from "./SingleMessage";
import { setUserPosts } from "../../redux/actions";

export class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    usersRef: firebase.database().ref("users"),
    messages: [],
    messagesLoading: true,
    numUniqueUsers: null,
    searchTerm: "",
    filteredMessages: [],
    isChannelStarred: false,
  };
  async componentDidMount() {
    const { currentChannel, currentUser } = this.props;

    if (currentChannel && currentUser) {
      let loadedMessages = [];
      this.getMessagesRef()
        .child(currentChannel.id)
        .on("child_added", (snapshot) => {
          loadedMessages.push(snapshot.val());
          this.setState({ messages: loadedMessages, messagesLoading: false });
          this.countUsers(loadedMessages);
          this.countUserPosts(loadedMessages);
        });
      //FETCHING STARRED FROM FIREBASE
      const data = await this.state.usersRef
        .child(currentUser.uid)
        .child("starred")
        .once("value");
      if (data.val() !== null) {
        const starredChannelVal = Object.keys(data.val()).includes(
          currentChannel.id
        );
        this.setState({ isChannelStarred: starredChannelVal });
      }
    }
  }
  componentWillUnmount() {
    const { currentChannel } = this.props;
    this.getMessagesRef().child(currentChannel.id).off();
  }
  countUserPosts = (messages) => {
    const userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };
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
  getMessagesRef = () => {
    const { isPrivateChannel } = this.props;
    const { messagesRef, privateMessagesRef } = this.state;
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };
  handleStar = () => {
    const { currentChannel, currentUser } = this.props;

    this.setState({ isChannelStarred: !this.state.isChannelStarred }, () => {
      if (this.state.isChannelStarred) {
        this.state.usersRef.child(`${currentUser.uid}/starred`).update({
          [currentChannel.id]: {
            name: currentChannel.name,
            details: currentChannel.details,
            createdBy: {
              name: currentChannel.createdBy.name,
              avatar: currentChannel.createdBy.avatar,
            },
          },
        });
      } else {
        this.state.usersRef
          .child(`${currentUser.uid}/starred`)
          .child(currentChannel.id)
          .remove((err) => err && console.log(err));
      }
    });
  };
  render() {
    const { messages, numUniqueUsers, searchTerm } = this.state;
    const { currentUser, currentChannel } = this.props;

    const newMessages = this.state.messages.filter(
      (message) =>
        (message.content &&
          message.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.user.name &&
          message.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return (
      <React.Fragment>
        <MessagesHeader
          messages={messages}
          currentChannel={currentChannel}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          handleStar={this.handleStar}
          isChannelStarred={this.state.isChannelStarred}
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
        <MessagesForm getMessagesRef={this.getMessagesRef} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    isPrivateChannel: state.channel.isPrivateChannel,
  };
};

export default connect(mapStateToProps, { setUserPosts })(Messages);
