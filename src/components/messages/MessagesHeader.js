import React, { Component } from "react";
import { Segment, Header, Icon, Input } from "semantic-ui-react";
import { connect } from "react-redux";

export class MessagesHeader extends Component {
  render() {
    const { currentChannel, numUniqueUsers, isPrivateChannel } = this.props;

    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {isPrivateChannel ? "@" : "#"}
            {currentChannel.name}
            {!isPrivateChannel && <Icon name="star outline" color="black" />}
          </span>
          <Header.Subheader>
            {numUniqueUsers ? numUniqueUsers : "0"}{" "}
            {numUniqueUsers === 1 ? "User" : "Users"}
          </Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
            onChange={this.props.handleSearchChange}
          />
        </Header>
      </Segment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isPrivateChannel: state.channel.isPrivateChannel,
  };
};

export default connect(mapStateToProps)(MessagesHeader);
