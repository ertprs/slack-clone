import React, { Component } from "react";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

export class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    errors: [],
  };

  isFormValidTest = () => {
    let errors = [];
    let error;
    const { username, password, confirmPassword, email } = this.state;
    if (
      !username.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !email.trim()
    ) {
      error = { message: "Please fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (password !== confirmPassword) {
      error = { message: "Passwords do not match" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (
      password.trim().length < 6 ||
      confirmPassword.trim().length < 6
    ) {
      error = { message: "Password must be at least six characters" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    if (this.isFormValidTest()) {
      this.setState({ loading: true });
      try {
        const createdUser = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );
        this.setState({ loading: false });
        console.log(createdUser);
      } catch (error) {
        this.setState({ loading: false });
        console.log(error);
      }
    }
    setTimeout(() => {
      this.setState({ errors: [] });
    }, 3000);
    this.setState({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    });
  };
  displayErrors = (errors) =>
    errors.map((error, index) => <p key={index}>{error.message}</p>);
  render() {
    const { password, confirmPassword, username, email, errors } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for SlackChat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
                type="text"
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
                type="email"
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="passoword"
                onChange={this.handleChange}
                value={password}
                type="password"
              />
              <Form.Input
                fluid
                name="confirmPassword"
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                onChange={this.handleChange}
                value={confirmPassword}
                type="password"
              />
              <Button
                loading={this.state.loading}
                color="orange"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>

          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user ? <Link to="/login">Login</Link>{" "}
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
