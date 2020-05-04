import React, { Component } from "react";
import { Segment, Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";

export class MessagesForm extends Component {
  state = {
    message: "",
    loading: false,
    errors: [],
  };
  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });
  sendMessage = async () => {
    const { messagesRef, currentChannel } = this.props;
    const { message } = this.state;
    if (message.trim()) {
      this.setState({ loading: true });
      try {
        await messagesRef
          .child(currentChannel.id)
          .push()
          .set(this.createMessage());
        this.setState({ message: "", loading: false, errors: [] });
      } catch (error) {
        console.log(error);
        this.setState({
          loading: false,
          errors: this.state.errors.concat(error),
        });
      }
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "add a message" }),
      });
    }
  };
  createMessage = () => {
    const { currentUser } = this.props;
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
      content: this.state.message,
    };
    return message;
  };
  render() {
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon="add" />}
          labelPosition="left"
          placeholder="Write your Message"
          onChange={this.handleChange}
          className={
            this.state.errors.some((error) => error.message.includes("message"))
              ? "error"
              : ""
          }
          value={this.state.message}
        />
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
            loading={this.state.loading}
            disabled={this.state.loading}
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentChannel: state.channel.currentChannel,
    currentUser: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(MessagesForm);
