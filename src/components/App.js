import React from "react";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./colorPanel/ColorPanel";
import SidePanel from "./sidePanel/SidePanel";
import Messages from "./messages/Messages";
import MetaPanel from "./metaPanel/MetaPanel";
import { connect } from "react-redux";
import Spinner from "./spinner/Spinner";

function App({ currentChannel, isPrivateChannel }) {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel />
      <Grid.Column style={{ marginLeft: 320 }}>
        {currentChannel ? (
          <Messages key={currentChannel.id} currentChannel={currentChannel} />
        ) : (
          <Spinner />
        )}
      </Grid.Column>
      <Grid.Column width={4}>
        {!isPrivateChannel && currentChannel && <MetaPanel />}
      </Grid.Column>
    </Grid>
  );
}
const mapStateToProps = (state) => {
  return {
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
  };
};
export default connect(mapStateToProps)(App);
