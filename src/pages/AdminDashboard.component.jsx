import React, { PureComponent } from "react";
import { IdleTimerComponent } from 'react-idle-timer';
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

class AdminHomeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true
      // initialize state here
    };
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
              <Tab eventKey="viewCategories" title="View Categories"> {/* add orders content here */}</Tab>
            </Tabs>
          </Tab>
          <Tab eventKey="item" title="Item">
            <Tabs defaultActiveKey="addItem" animation="false" className="mb-0">
                <Tab eventKey="addItem" title="Register Item"> <AddItem /></Tab>
                <Tab eventKey="viewItems" title="View Registered Items"> {/* add orders content here */}</Tab>
                <Tab eventKey="addItemToInventory" title="Add Item to Inventory"> <AddItemDetails /> </Tab> 
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
        </Tabs>
      </div>
    );
  }
}

export default withRouter(AdminHomeComponent)