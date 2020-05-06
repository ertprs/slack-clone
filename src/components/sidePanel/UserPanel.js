import React, { Component } from "react";
import firebase from "../../firebase";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import { connect } from "react-redux";

export class UserPanel extends Component {
  dropdownOptions = () => {
    const { currentUser } = this.props;
    return [
      {
        key: "user",
        text: (
          <span>
            sign in as <strong>{currentUser.displayName} </strong>
          </span>
        ),
        disabled: true,
      },
      {
        key: "avatar",
        text: <span>Change Avatar</span>,
      },
      {
        key: "signout",
        text: <span onClick={this.handleSignOut}>Sign Out</span>,
      },
    ];
  };
  handleSignOut = async () => {
    await firebase.auth().signOut();
    console.log("signed out");
  };
  render() {
    return (
      <Grid style={{ background: this.props.primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* APP HEADER */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>SlackChat</Header.Content>
            </Header>
            {/* USER DROPDOWN */}
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image
                      src={this.props.currentUser.photoURL}
                      spaced="right"
                      avatar
                    />
                    {this.props.currentUser.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
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
  };
};
export default connect(mapStateToProps)(UserPanel);
