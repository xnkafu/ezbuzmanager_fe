import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import {url} from '../config/url.js';
import Cookies from 'universal-cookie';

export default class AddShipmentDate extends React.Component {
     constructor(props) {
        super(props) 
        this.state = {
            employee: {},
            date: "",
            retrievedDates: [],
            search:'',
            currentPage: 1, // The current page number
            itemsPerPage: 5 // The number of items to show per page
         }
         this.handleChange = this.handleChange.bind(this)
         this.clearForm = this.clearForm.bind(this)
     }

     getCurrentDates() {
        const { retrievedDates, currentPage, itemsPerPage } = this.state;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return retrievedDates.slice(indexOfFirstItem, indexOfLastItem);
      }
    
      // Change the page
      paginate(pageNumber) {
        this.setState({ currentPage: pageNumber });
      }

     handleChange(event) {
         const value = event.target.value
         const name = event.target.name
         this.setState({
             ...this.state,
             [name]: value
         })
     }

     saveDate = async () => {
        const cookies = new Cookies();
        const user = cookies.get('user');

         let payload = {
             employee: user,
             date: this.state.date
            
        }
        console.log("payload is ")
        console.log(payload)
        await axios({
            url: url+"/v1/api/shipmentDate/createShipmentDate",
            method: "POST",
            headers: {
              //  authorization: "",
                'Access-Control-Allow-Origin': '*',
                'ngrok-skip-browser-warning': '*'
            },
            data: payload,
        })
        .then( response => {
            alert("Date Saved")
            this.clearForm()
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Date already exist. Enter a different name"})
            }
        })
         this.backendDates()
     }

     clearForm() {
        this.setState({date: ""})
    }

    showDates = (dates) => {
       
            return dates.map((date, ind) => {
                return <tr key={ind}>
                    <td >{ind+1}</td>
                    <td>{date.date}</td>
                    <td>{date.employee.firstname + " " + date.employee.lastname}</td>
                </tr>
            })
        
        
    }
    componentDidMount() {
        this.backendDates()
    }
    
    backendDates = () => {
        axios({
            url: url+"/v1/api/shipmentDate/shipmentDates",
            method: "GET",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*',
                'ngrok-skip-browser-warning': '*'
            },
        })
        .then( response => {
            this.setState({retrievedDates: response.data.reverse()})          
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Error occurred"})
            }
        } )
    }

     render() {
        // Get the current page of sales
        const currentDates = this.getCurrentDates();

        // Calculate the total number of pages
        const { retrievedDates, itemsPerPage } = this.state;
        const totalPages = Math.ceil(retrievedDates.length / itemsPerPage);

        // Generate the page numbers
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
        }

         return <form onSubmit={this.saveDate}>
             <div className='card'>
                 <div className='card-header bg-info'>
                     <div className='row'>
                     <div className='col-3'><h4>Add New Shipment Date</h4></div>
                     <div className='col-3'></div>
                     <div className='col-3'> <button type='button' className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                     <div className='col-3'> <button type='submit' className='form-control bg-success' > Save</button></div>
                    </div>
                 </div>
                 <div className='card-body'>
                     
                    
                     <div className='row'>
                        <div className='col-2'>
                            <label htmlFor="">Date:</label>
                        </div>
                        <div className='col-10'>
                            <input type='date' className='form-control' name='date' onChange={this.handleChange} value={this.state.date} required></input>
                         </div>
                     </div>

       
                 </div>
                 
             </div>
             <div className='card'>
                 <div className='card-body'>
                     <table className='table table-striped table-bordered table-hover'>
                         <thead className='thead-dark'>
                             <tr>
                                 <th scope='col'>#</th>
                                 <th>Date</th>
                                 <th>Created By</th>
                             </tr>
                         </thead>
                         <tbody>
                             {this.showDates(currentDates)}
                         </tbody>
                     </table>
                 </div>
             </div>
             
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
         </form>
     }
}