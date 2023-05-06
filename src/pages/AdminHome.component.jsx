import React, { PureComponent } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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
                <TabList>
                    <Tab> Category</Tab>
                    <Tab> Add Item</Tab>
                    <Tab> Add Item Details</Tab>
                    <Tab> Perform Sale</Tab>
                    <Tab> View Sales</Tab>
                    <Tab> Customers</Tab>
                    <Tab> Employees</Tab>
                    <Tab> Expenses</Tab>
                    <Tab> Perform sale No Scanner</Tab>
                </TabList>
                <TabPanel><AddCategory /> </TabPanel>
                <TabPanel><AddItem /> </TabPanel>
                <TabPanel> <AddItemDetails /> </TabPanel>
                <TabPanel> <PerformSale/> </TabPanel>
                <TabPanel>  </TabPanel>
                <TabPanel> <AddCustomer /> </TabPanel>
                <TabPanel> <AddEmployee/> </TabPanel>
                <TabPanel>  </TabPanel>
                <TabPanel> <PerformSaleNoScanner/> </TabPanel>
            </Tabs>
            
        </div>
    );
  }
}

export default withRouter(AdminHomeComponent)