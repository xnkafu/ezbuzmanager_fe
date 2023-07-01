import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { ListGroup } from 'react-bootstrap';
import {url} from '../config/url.js';

class ViewStockHistoryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      stockHistoryById: [],
      stockHistories: [], // An empty array to hold the sales data
      stockHistoryDates: [],
      currentPage: 1, // The current page number
      itemsPerPage: 20 // The number of items to show per page
    };
  }

  componentDidMount() {
    this.getStockDates()   
  }

  getStockDates = ()=> {
    axios({
      url: url+"/v1/api/stockHistory/stockDates",
      method: "GET",
      headers: {
        //  authorization: "",
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '*'
      },
      })
       .then(response => {
           this.setState({ stockHistoryDates: response.data.reverse() })
           console.log(response.data)
      })
      .catch(err => { 
          //const code = err.response.status
          console.error(err)
     })
  }
  
  getStockForId =  (id) => {
   // var id = this.state.id
       axios({
                              url: url+"/v1/api/stockHistory/"+id,
                              method: "GET",
                              headers: {
                                //  authorization: "",
                                  'Access-Control-Allow-Origin': '*',
                                  'ngrok-skip-browser-warning': '*'
                              },
                              
                              })
                              .then(response => {
                                  this.setState({ stockHistoryById: response.data.reverse() })
                                  console.log(response.data)
                                  
                              })
                              .catch(err => { 
                                  //const code = err.response.status
                                  console.error(err)
                            })
                           
  }

  displayStockHistory = () => {
    var StockHistById = this.state.stockHistoryById
    return StockHistById.map((stockItem,ind)=>{
      return <tr key={ind}>
        <td>{ind+1}</td>
        <td>{stockItem.item.name + " " + stockItem.item.model + " " + stockItem.item.description }</td>
        <td>{stockItem.shipmentDate}</td>
        <td>{stockItem.initialQty}</td>
        <td>{stockItem.quantitySold}</td>
        <td>{stockItem.expectedQty}</td>
        <td>{stockItem.actualQty}</td>
      </tr>
  }) 
    
  }

  showStockdates = () => {
    
    return this.state.stockHistoryDates.map((sDate,ind)=>{
     // console.log(sDate)
      return <button key={ind} onClick={()=>this.getStockForId(sDate.id)} className='bg-info'>{sDate.date}</button>
    })
  }

  showHeader = ()=>{
    var header = this.state.stockHistoryById.date
    if (header != undefined) {
      return {header}
    }
  }

  render() {
    

    return (
        <div className='row'>
          <div className='col-3'>
            <div className="card"> 
              <div className='card-body'>
                {this.showStockdates()}
              </div>
            </div>
          </div>
          <div className='col-9'>
            <div className="card"> 
                <div className='card-body'>
                  <p>{this.showHeader()}</p>
                  <table className='table'>
                      <thead className='thead-dark'>
                        <tr>
                          <th>#</th>
                          <th>Item</th>
                          <th>Shipment Date</th>
                          <th>Initial Quantity</th>
                          <th>Quantity Sold</th>
                          <th>Expected Stock</th>
                          <th>Actual Stock</th>
                        </tr>
                      </thead>
                    <tbody className="table table-striped">
                      {this.displayStockHistory()}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        </div>
           
    );
  }
}

export default ViewStockHistoryComponent;


//export default withRouter(ViewSalesComponent)
