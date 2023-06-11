import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { ListGroup } from 'react-bootstrap';
import {url} from '../config/url.js';

class StockTrackerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: [], // An empty array to hold the sales data
      currentPage: 1, // The current page number
      itemsPerPage: 5 // The number of items to show per page
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

    componentDidMount() {
      
    // Here you can fetch the sales data from an API or a database
    // and update the state with the fetched data
    // For this example, we will just populate the state with 10 items
    
        axios({
         url: url+"/v1/api/itemInventory/stock",
         method: "GET",
         headers: {
           //  authorization: "",
             'Access-Control-Allow-Origin': '*',
             'ngrok-skip-browser-warning': '*'
         },
         })
          .then(response => {
              this.setState({ stock: response.data })
              console.log('stock', response.data)
         })
         .catch(err => { 
             //const code = err.response.status
             console.error(err)
        })
     
  }

  // Get the current page of sales
  getCurrentStock() {
    const { stock, currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return stock.slice(indexOfFirstItem, indexOfLastItem);
  }

  // Change the page
  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

 

  render() {
    // Get the current page of sales
    const currentSales = this.getCurrentStock();

    // Calculate the total number of pages
    const { stock, itemsPerPage } = this.state;
    const totalPages = Math.ceil(stock.length / itemsPerPage);

    // Generate the page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
        <div className="card">
            <div className='card-header'>
                <h2>Stock Tracker</h2>
            </div>
        
        <table className="table">
          <thead>
                    <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Shipment Date</th>
                        <th>Quantity-Initial</th>
                        <th>Quanity sold</th>
                        <th>Quantity-Expected</th>
                        <th>Quantity-Actual</th>
            </tr>
          </thead>
          <tbody>
            {currentSales.map((stockItem,index) => (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{stockItem.item.name + " " + stockItem.item.model + " " + stockItem.item.description }</td>
                    <td>{stockItem.shipmentDate}</td>
                    <td>{stockItem.initialStock}</td>
                    <td>{stockItem.quantitySold}</td>
                    <td>{stockItem.currentStock}</td>
                    <td><input type="number" className='form-control' name='actualStock'onChange={this.handleChange}/></td>

              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${this.state.currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link"
                onClick={() => this.paginate(this.state.currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {pageNumbers.map(number => (
                <li
                  key={number}
                  className={`page-item ${this.state.currentPage === number ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => this.paginate(number)}>
                    {number}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  this.state.currentPage === pageNumbers.length ? 'disabled' : ''
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => this.paginate(this.state.currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default StockTrackerComponent;


//export default withRouter(ViewSalesComponent)
