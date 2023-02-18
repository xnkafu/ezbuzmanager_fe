import React, { PureComponent } from "react";
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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

 class AdminHomeComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        value: '',
        setValue: ''
    };
  }
  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      ...this.state,
      [name]: value,
    });
    console.log(this.state);
  };
  
  render() {
    return (
        <div className="card">
        <Tabs>
          
            
              <Tab title='Add Item' eventKey='Add Item'><AddCategory /></Tab>
              <Tab title='Add Item Details' eventKey='AddItemDetails'> <AddItemDetails /> </Tab>
              <Tab title='Perform Sale' eventKey='Add Item'> <AddItem /> </Tab>
           
          
                    
               
        </Tabs>
            
        </div>
    );
  }
}

export default withRouter(AdminHomeComponent)