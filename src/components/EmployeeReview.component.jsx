import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import {url} from '../config/url.js';
import Cookies from 'universal-cookie';

export default class EmployeeReview extends React.Component {
     constructor(props) {
        super(props) 
        this.state = {
            description: "",
            date: "",
            retrievedEmployees: [],
            retrievedReviews: [],
            search:'',
            reviewType:'',
            employeeToReview: '',
            currentPage: 1, // The current page number
            itemsPerPage: 5 // The number of items to show per page
         }
         this.handleChange = this.handleChange.bind(this)
         this.clearForm = this.clearForm.bind(this)
     }

     getCurrentReviews() {
        const { retrievedReviews, currentPage, itemsPerPage } = this.state;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return retrievedReviews.slice(indexOfFirstItem, indexOfLastItem);
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

     saveReview = async () => {
        const cookies = new Cookies();
        const user = cookies.get('user');
        const d = new Date();
        
         let payload = {
             description: this.state.description,
             employeeId: this.state.employeeToReview,
             date: d,
             reviewType: this.state.reviewType,
             reporter: user
            
        }
        console.log("payload is ")
        console.log(payload)
        await axios({
            url: url+"/v1/api/employeeReview/createReview",
            method: "POST",
            headers: {
              //  authorization: "",
                'Access-Control-Allow-Origin': '*',
                'ngrok-skip-browser-warning': '*'
            },
            data: payload,
        })
        .then( response => {
            //this.setState({rev})
            alert("Employee Review Saved")
            this.clearForm()
            this.backendReviews()
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Note already exist. Enter a different name"})
            }
        })
         this.backendReviews()
     }

     clearForm() {
        this.setState({description: ""})
    }

    showReviews = (reviews) => {
        var searchTemp = this.state.search
       // var notes = this.state.retrievedNotes
        if (this.state.search === "") {
            return reviews.map((review, ind) => {
                var d = new Date(review.date)
                return <tr key={ind}>
                    <td >{ind+1}</td>
                    <td>{d.toLocaleString('en-US', { timeZone: "Africa/Douala" })} </td>
                    <td>{review.employee.lastname + " " + review.employee.firstname}</td>
                    <td>{review.reviewType}</td>
                    <td>{review.description}</td>
                    <td>{review.reporter.lastname + " " +review.reporter.firstname}</td>
                </tr>
            })
        } else {
            return reviews.map((review, ind) => {
                var d = new Date(review.date)
                if (review.employee.lastname.toUpperCase().includes(searchTemp.toUpperCase()) || review.employee.firstname.toUpperCase().includes(searchTemp.toUpperCase())) {
                    var d = new Date(review.date)
                    return <tr key={ind}>
                        <td >{ind+1}</td>
                        <td>{d.toLocaleString('en-US', { timeZone: "Africa/Douala" })} </td>
                        <td>{review.employee.lastname + " " + review.employee.firstname}</td>
                        <td>{review.description}</td>
                </tr>
                }
                
            })
        }
        
    }
    componentDidMount() {
        this.backendReviews()
        this.backendEmployees()
    }

    backendEmployees = () => {
        axios({
            url: url+"/v1/api/employee/employees",
            method: "GET",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '*'
            },
        })
        .then( response => {
            this.setState({retrievedEmployees: response.data})          
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Error occurred"})
            }
        } )
    }
    
    backendReviews = () => {
        axios({
            url: url+"/v1/api/employeeReview/reviews",
            method: "GET",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*',
                'ngrok-skip-browser-warning': '*'
            },
        })
        .then( response => {
            this.setState({retrievedReviews: response.data.reverse()})          
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Error occurred"})
            }
        } )
    }

    populateOptions =  () => {
        const employees = this.state.retrievedEmployees
        return employees.map((employee,ind) => {
           // console.log(employee)
            return <option key={ind} value={employee.id}>{employee.lastname + " " + employee.firstname}</option>
        })
   }

     render() {
        // Get the current page of sales
        const currentReviews = this.getCurrentReviews();

        // Calculate the total number of pages
        const { retrievedEmployees, itemsPerPage } = this.state;
        const totalPages = Math.ceil(retrievedEmployees.length / itemsPerPage);

        // Generate the page numbers
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
        }

         return <div className='container'>
             <div className='card'>
                 <div className='card-header bg-info'>
                     <div className='row'>
                     <div className='col-3'><h4>Add Employee Review</h4></div>
                     <div className='col-3'></div>
                     <div className='col-3'> <button className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                     <div className='col-3'> <button type='submit' className='form-control bg-success' onClick={this.saveReview} > Save</button></div>
                    </div>
                 </div>
                 <div className='card-body'>
                     
                    <div className='row'>
                            <div className='col-2'>
                                <label htmlFor=""> Employee:</label>
                            </div>
                            <div className='col-5'>
                                <select name="employeeToReview" className='form-control' onChange={this.handleChange} required>
                                    
                                    {this.populateOptions()}
                                </select>
                             </div>
                             <div className='col-1'>
                                <label htmlFor=""> Review Type:</label>
                            </div>
                            <div className='col-3'>
                                <select name="reviewType" className='form-control' onChange={this.handleChange}  required>
                                     <option value=''></option>
                                     <option value='Positive'>Positive</option>
                                     <option value='Negative'>Negative</option>
                                </select>
                             </div>
                        </div>

                     <div className='row'>
                        <div className='col-2'>
                            <label htmlFor="">Review Description:</label>
                        </div>
                        <div className='col-10'>
                            <textarea className='form-control' name='description' rows="5" placeholder="Report the following :
                            - who visited the store and what they bought if they purchased any items, 
                            - summary of the day's sale, 
                            - what laptops were repairs, 
                            - etc" onChange={this.handleChange} value={this.state.description}></textarea>
                         </div>
                     </div>

       
                 </div>
                 
             </div>
             <div className='card'>
                 <div className='card-header bg-dark'>
                     <div className='row'>
                     <div className='col-12'> <input type="text" className='form-control' name='search' placeholder="Search Notes by Employee name" onChange={this.handleChange} value={this.state.search} /></div>
                 </div>
                 </div>
                 <div className='card-body'>
                     <table className='table table-striped table-bordered table-hover'>
                         <thead className='thead-dark'>
                             <tr>
                                 <th scope='col'>#</th>
                                 <th>Review Date</th>
                                 <th>Employee Name</th>
                                 <th>Review Type</th>
                                 <th> Review Description</th>
                                 <th> Reported By</th>
                             </tr>
                         </thead>
                         <tbody style={{ whiteSpace: 'pre-wrap' }}>
                             {this.showReviews(currentReviews)}
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
         </div>
     }
}