import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";
import { connect } from "react-redux";

export class Starred extends Component {
  state = {
    starredChannels: [],
    activeChannel: null,
  };
  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  changeChannel = (channel) => {
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setActiveChannel(channel);
  };
  render() {
    const { starredChannels, activeChannel } = this.state;
    return (
      <Menu.Menu>
        <Menu.Item>
          <span>
            <Icon name="star" /> STARRED ({starredChannels.length})
          </span>{" "}
        </Menu.Item>
        {/* DISPLAY CHANNELS */}
        {starredChannels &&
          starredChannels.map((channel) => (
            <Menu.Item
              key={channel.id}
              onClick={() => this.changeChannel(channel)}
              name={channel.name}
              style={{ opacity: 0.7 }}
              active={activeChannel === channel.id}
            >
              # {channel.name}
            </Menu.Item>
          ))}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setPrivateChannel, setCurrentChannel })(Starred);
