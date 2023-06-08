import React, { PureComponent } from "react";
import { useIdleTimer } from 'react-idle-timer';
import { Redirect } from 'react-router-dom';
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import  { Component } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import 'react-tabs/style/react-tabs.css';
import AddCategory from "../components/AddCategory.component";
import AddCustomer from "../components/AddCustomer.component";
import AddEmployee from "../components/AddEmployee.component";
import AddItem from "../components/AddItem.component";
import AddItemDetails from "../components/AddItemDetails.component";
import PerformSale from "../components/PerformSale.component";
import PerformSaleComponent from "../components/PerformSale.component";
import {withRouter,Link} from 'react-router-dom'
import PerformSaleNoScanner from "../components/PerformSaleNoScanner.component";
import ViewSalesComponent from "../components/ViewSales.component";
import Navbar from "../components/Navbar.component";
import AddNote from "../components/AddNote.component";
import Cookies from 'universal-cookie';
import ViewCategoriesComponent from "../components/ViewCategories.component";

class AdminHomeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true,
      // initialize state here
      timeout:1000 * 5 * 1,
      showModal: false,
      userLoggedIn: false,
      isTimedOut: false
    };
    this.idleTimer = null
    this.onAction = this._onAction.bind(this)
    this.onActive = this._onActive.bind(this)
    this.onIdle = this._onIdle.bind(this)
  }

  
  _onAction(e) {
    console.log('user did something', e)
    this.setState({isTimedOut: false})
  }
 
  _onActive(e) {
    console.log('user is active', e)
    this.setState({isTimedOut: false})
  }
 
  _onIdle(e) {
    console.log('user is idle', e)
    const isTimedOut = this.state.isTimedOut
    if (isTimedOut) {
        this.props.history.push('/')
    } else {
      this.setState({showModal: true})
      this.idleTimer.reset();
      this.setState({isTimedOut: true})
    }
    
  }

  componentDidMount = ()=>{
    const cookies = new Cookies();
    const user = cookies.get('user');
    console.log(' user is ')
    console.log(user)

    if (user === null || user == undefined) {
      const { history } = this.props
      history.push('/login')
    }

  }
  
  render() {
     
    return (
      <div>
        <Navbar />
        {/* idle timer */}
   
        
        {/* navigation tabs */}
        <Tabs defaultActiveKey="category" animation="false" className="mb-0">
          <Tab eventKey="category" title="Catgeory">
            <Tabs defaultActiveKey="addCategory" animation="false" className="mb-0">
              <Tab eventKey="addCategory" title="Add Category"> <AddCategory /> </Tab>
              <Tab eventKey="viewCategories" title="View Categories"> <ViewCategoriesComponent/></Tab>
            </Tabs>
          </Tab>
          <Tab eventKey="item" title="Item">
            <Tabs defaultActiveKey="addItem" animation="false" className="mb-0">
                <Tab eventKey="addItem" title="Register Item"> <AddItem /></Tab>
                <Tab eventKey="viewItems" title="View Registered Items"> {/* add orders content here */}</Tab>
                <Tab eventKey="addItemToInventory" title="Add Item to Inventory"> <AddItemDetails /> </Tab> 
                <Tab eventKey="addShipmentDate" title="Add Shipment Date">  </Tab> 
            </Tabs>
          </Tab>
          <Tab eventKey="Sale" title="Sale">
            <Tabs defaultActiveKey="performSale" animation="false" className="mb-0">
                <Tab eventKey="performSaleNS" title="Perform Sale NS"> <PerformSaleNoScanner /></Tab>
                <Tab eventKey="viewSales" title="View  Sales"> <ViewSalesComponent /></Tab>
            </Tabs>           
          </Tab>
          <Tab eventKey="customers" title="Customers">
            <AddCustomer />           
          </Tab>
          <Tab eventKey="employees" title="Employees">
            <AddEmployee />           
          </Tab>
          <Tab eventKey="notes" title="Work Notes">
            <AddNote />     
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(AdminHomeComponent)