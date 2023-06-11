import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { ListGroup } from 'react-bootstrap';
import {url} from '../config/url.js';
import {Modal,Button} from 'react-bootstrap'

class ViewCategoriesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [], // An empty array to hold the sales data
      currentPage: 1, // The current page number
      itemsPerPage: 20 // The number of items to show per page
    };
  }

    componentDidMount() {
      
    // Here you can fetch the sales data from an API or a database
    // and update the state with the fetched data
    // For this example, we will just populate the state with 10 items
    this.getCategories()
        
     
  }

  // Get the current page of sales
  getCurrentCategories() {
    const { categories, currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return categories.slice(indexOfFirstItem, indexOfLastItem);
  }

  // Change the page
  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  getCategories =()=>{
    axios({
      url: url+"/v1/api/category/categories",
      method: "GET",
      headers: {
        //  authorization: "",
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '*'
      },
      })
       .then(response => {
           this.setState({ categories: response.data.reverse() })
           console.log(response.data)
      })
      .catch(err => { 
          //const code = err.response.status
          console.error(err)
     })
  }

  render() {
    // Get the current page of categories
    const currentCategories = this.getCurrentCategories();

    // Calculate the total number of pages
    const { categories, itemsPerPage } = this.state;
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    // Generate the page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }


    return (
        <div className="card">
            <div className='card-header bg-info'>
              <div className='row'>
                <div className='col-3'><h2>List of Saved Categories</h2></div>
                <div className='col-3'><Button className='form-control  bg-primary rounded-circle' onClick={this.getCategories}>Refresh List</Button></div>
              </div>
            </div>
            <div id='printDiv'></div>
        
        <table className="table">
          <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category,index) => (
                <tr key={category.id}>
                    <td>{index+1}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
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

export default ViewCategoriesComponent;


//export default withRouter(ViewSalesComponent)
