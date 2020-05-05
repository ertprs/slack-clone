import React, { Component } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";

export class Channels extends Component {
  state = {
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
  };
  componentDidMount() {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", (snapshot) => {
      loadedChannels.push(snapshot.val());
      this.setState({ channels: loadedChannels }, () =>
        this.props.setCurrentChannel(this.state.channels[0])
      );
    });
  }
  componentWillUnmount() {
    this.state.channelsRef.off();
  }
  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });
  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };
  isFormValid = ({ channelName, channelDetails }) =>
    channelName.trim() && channelDetails.trim();

  addChannel = async () => {
    const { channelName, channelDetails, channelsRef } = this.state;
    const { currentUser } = this.props;
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };
    await channelsRef.child(key).update(newChannel);
    this.setState({ channelName: "", channelDetails: "", modal: false });
  };
  render() {
    const { channels, modal, channelName, channelDetails } = this.state;
    const { currentChannel } = this.props;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}){" "}
            <Icon
              name="add"
              style={{ cursor: "pointer" }}
              onClick={this.openModal}
            />
          </Menu.Item>
          {/* DISPLAY CHANNELS */}
          {channels.length > 0 &&
            currentChannel &&
            channels.map((channel) => (
              <Menu.Item
                key={channel.id}
                onClick={() => {
                  this.props.setCurrentChannel(channel);
                  this.props.setPrivateChannel(false);
                }}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={currentChannel.id === channel.id}
              >
                # {channel.name}
              </Menu.Item>
            ))}
        </Menu.Menu>

        {/* ADD CHANNEL MODAL */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  value={channelName}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  value={channelDetails}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleSubmit} color="green" inverted>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" onClick={this.closeModal} inverted>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  let currentUser;
  if (state.user.currentUser) {
    currentUser = state.user.currentUser;
  }

  return {
    currentUser: currentUser,
    currentChannel: state.channel.currentChannel,
  };
};

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(Channels);
