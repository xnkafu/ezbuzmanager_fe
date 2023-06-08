import React, { Component } from 'react';
import {withRouter,Link} from 'react-router-dom'
import Cookies from 'universal-cookie';


class Navbar extends Component {
    constructor(props) {
        super(props)
    }

    logout = () => {
        const  { history } = this.props

        const cookies = new Cookies();
        cookies.remove('user');
        //reset local storage
        history.push('/login')
        
    }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <h4 className="navbar-brand" >Computer Village Store</h4>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="navbar-nav">
            <button className="nav-item nav-link btn btn-link" onClick={this.logout}>
              <b>Logout</b>
            </button>
          </div>
        </div>
      </nav>
    );
  }
}

//export default Navbar;
export default withRouter(Navbar);
