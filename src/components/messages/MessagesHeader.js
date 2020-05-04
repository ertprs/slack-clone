import React, { Component } from "react";
import { Segment, Header, Icon, Input } from "semantic-ui-react";

export class MessagesHeader extends Component {
  
 
  render() {
    const { currentChannel, numUniqueUsers } = this.props;

    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {currentChannel.name}
            <Icon name="star outline" color="black" />
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

export default MessagesHeader;
