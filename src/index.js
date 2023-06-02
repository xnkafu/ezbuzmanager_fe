import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AddCategory from './components/AddCategory.component';
import AddItemDetails from './components/AddItemDetails.component';
import PerformSaleComponent from './components/PerformSale.component';
import HomeComponent from './pages/AdminHome.component';
import AdminHomeComponent from './pages/AdminHome.component';
import LoginComp from './components/Login.component';
//import { Router } from 'react-router';
import{BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import AdminDashboardComponent from './pages/AdminDashboard.component';
import ViewSalesComponent from './components/ViewSales.component';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <div>
    <Router>
      <Switch>

        <Route path=''>
          <LoginComp />
        </Route>
        <Route path='/login'>
          <LoginComp />
        </Route>
        <Route path='/dashboard'>
          <AdminHomeComponent />
      </Route >
      <Route path='/admin-dashboard'>
          <AdminDashboardComponent />
      </Route>
      <Route path='/sales'>
          <ViewSalesComponent />
      </Route>
      </Switch>
    </Router>
    </div> 
 // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
