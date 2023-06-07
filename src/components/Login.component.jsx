import React, { PureComponent } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import {withRouter,Link} from 'react-router-dom'
import { Form, Button } from 'react-bootstrap';
import {url} from '../config/url.js';


  class LoginComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
          errMessage: '',
        };
    }
    
      handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
      };
    
      handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
      };
    
      handleSubmit = async (event) => {
        event.preventDefault();
      
        // Make a POST request to your login API endpoint with the username and password
        const response = await fetch(url+'/v1/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': ''
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password
          })
        });
      
        // If the login was successful, store the token and user info in localStorage
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
          // Reset the form
            this.setState({ username: '', password: '' });
            const { history } = this.props
            history.push('/admin-dashboard')
        } else {
          // Handle login errors here
          if (response.status === 400) {
            this.setState({ errMessage: 'Invalid username or password'});
          }
        }
      };
    
      render() {
        return (
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="container bg-white p-5 rounded">
            <h1 className="text-center mb-5 text-primary"><b> THE COMPUTER VILLAGE STORE</b></h1>
              <h2 className="text-center mb-2">Login</h2>
              <p className="text-center mb-2 text-danger">{this.state.errMessage}</p>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={this.state.username}
                    onChange={this.handleUsernameChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-4">
                  Login
                </Button>
              </Form>
              <p className="text-center mt-4">
                Don't have an account? <a href="#">Sign up</a>
              </p>
            </div>
          </div>
        );
      }
      
    }
  
//    export default LoginComp;
export default withRouter(LoginComp);