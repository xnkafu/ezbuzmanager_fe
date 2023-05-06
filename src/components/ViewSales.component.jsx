import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { ListGroup } from 'react-bootstrap';

class ViewSalesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sales: [], // An empty array to hold the sales data
      currentPage: 1, // The current page number
      itemsPerPage: 5 // The number of items to show per page
    };
  }

    componentDidMount() {
      
    // Here you can fetch the sales data from an API or a database
    // and update the state with the fetched data
    // For this example, we will just populate the state with 10 items
    
        axios({
         url: "http://localhost:8080/v1/api/sales",
         method: "GET",
         headers: {
             authorization: "",
             'Access-Control-Allow-Origin': '*'
         },
         })
          .then(response => {
              this.setState({ sales: response.data })
              console.log(response.data)
         })
         .catch(err => { 
             //const code = err.response.status
             console.error(err)
        })
     
  }

  // Get the current page of sales
  getCurrentSales() {
    const { sales, currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sales.slice(indexOfFirstItem, indexOfLastItem);
  }

  // Change the page
  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  render() {
    // Get the current page of sales
    const currentSales = this.getCurrentSales();

    // Calculate the total number of pages
    const { sales, itemsPerPage } = this.state;
    const totalPages = Math.ceil(sales.length / itemsPerPage);

    // Generate the page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
        <div className="card">
            <div className='card-header'>
                <h2>View Sales</h2>
            </div>
        
        <table className="table">
          <thead>
                    <tr>
                        <th>#</th>
                        <th>ConfirmationCode</th>
                        <th>Item</th>
                        <th>Total</th>
                        <th>Customer</th>
                        <th>Sold By</th>
                        <th>Sold Date</th>
            </tr>
          </thead>
          <tbody>
            {currentSales.map((sale,index) => (
                <tr key={sale.id}>
                    <td>{index+1}</td>
                    <td>{sale.confirmationCode}</td>
                    <td>{sale.itemsSold}</td>
                    <td>{sale.total}</td>
                    <td>{sale.customer.firstname + " " + sale.customer.lastname}</td>
                    <td>{sale.employee.firstname}</td>
                    <td>{sale.salesDate}</td>

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

export default ViewSalesComponent;


//export default withRouter(ViewSalesComponent)
