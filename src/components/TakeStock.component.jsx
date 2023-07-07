import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { ListGroup } from 'react-bootstrap';
import {url} from '../config/url.js';
import Cookies from 'universal-cookie';

class TakeStockComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: [], // An empty array to hold the sales data
      filledStock: [],
      currentPage: 1, // The current page number
      itemsPerPage: 500 // The number of items to show per page
    };
  }

  handleChange = (stock,event) => {
    // const value = event.target.value;
    // const name = event.target.name;
    // this.setState({
    //   ...this.state,
    //   [name]: value,
    // });
    console.log(stock);
    console.log(event.target.value);
    var updatedFilledStock = this.state.filledStock.map((stockTemp,ind)=>{
      if (stock.item.id == stockTemp.item.id && stock.shipmentDate == stockTemp.shipmentDate ) {
        stockTemp.actualQuantity = event.target.value
        return stockTemp
      }
      
      return stockTemp
    })
    this.setState({filledStock: updatedFilledStock})
  };

  saveStockHistory = ()=> {
      var stockHistories = []
      const cookies = new Cookies();
        const user = cookies.get('user');

      this.state.filledStock.map((stock,ind)=>{
        var stockHistory = {
          item: stock.item,
          shipmentDate: stock.shipmentDate,
          initialQty: stock.initialStock,
          quantitySold: stock.quantitySold,
          expectedQty: stock.currentStock,
          actualQty: stock.actualQuantity,
          employee: user
        }
        stockHistories.push(stockHistory)
      })
    
      console.log('stock',this.state.stock)
      console.log('filledStock',this.state.filledStock)
    console.log(stockHistories)
     axios({
      url: url+"/v1/api/stockHistory/saveStockHistory",
      method: "POST",
      responseType: "application/json",
      headers: {
         // authorization: "",
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '*'
      },
      data: stockHistories,
     })
      .then(response => {
        //var resetStock = this.getBackendStock()
         //     this.setState({ stock: resetStock, filledStock: resetStock })
             // console.log('stockHis', response.data)
      })
         .catch(err => { 
             //const code = err.response.status
             console.error(err)
        })
     
  }

  componentDidMount (){
    this.getBackendStock()
  }
  getBackendStock = () => {
      
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
              this.setState({ stock: response.data,filledStock: response.data })
             // console.log('stock', response.data)
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
      <form>
        <div className="card">
            <div className='card-header'>
              <div className='row'>
                <div className='col-6'><h2>Stock Tracker</h2></div>
                <div className='col-6'><button className='form-control bg-info' onClick={this.saveStockHistory}>Save</button></div>
              </div>
                
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
                    <td><input type="number" className='form-control' name='actualStock'onChange={(e)=>this.handleChange(stockItem,e)}/></td>

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
      </form>
    );
  }
}

export default TakeStockComponent;


//export default withRouter(ViewSalesComponent)
