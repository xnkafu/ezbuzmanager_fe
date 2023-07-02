import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import {url} from '../config/url.js';
import Cookies from 'universal-cookie';
import { Form } from 'react-bootstrap';

export default class StoreTransactionsComponent extends React.Component {
     constructor(props) {
        super(props) 
        this.state = {
            description: "",
            associatedEmployee: '',
            retrievedEmployees: [],
            transactionType: '',
            amount: '',
            date: "",
            retrievedTransactions: [],
            search:'',
            currentPage: 1, // The current page number
            itemsPerPage: 5 // The number of items to show per page
         }
         this.handleChange = this.handleChange.bind(this)
         this.clearForm = this.clearForm.bind(this)
     }

     getCurrentTransactions() {
        const { retrievedTransactions, currentPage, itemsPerPage } = this.state;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return retrievedTransactions.slice(indexOfFirstItem, indexOfLastItem);
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

     saveTransaction = async (e) => {
        e.preventDefault()
        const cookies = new Cookies();
        const user = cookies.get('user');
        const d = new Date();

         let payload = {
             description: this.state.description,
             employee: user,
             associatedEmployee: this.state.associatedEmployee,
             date: d,
             amount: this.state.amount,
             type: this.state.transactionType
            
        }
        console.log("payload is ")
        console.log(payload)
        await axios({
            url: url+"/v1/api/transaction/createTransaction",
            method: "POST",
            headers: {
              //  authorization: "",
                'Access-Control-Allow-Origin': '*',
                'ngrok-skip-browser-warning': '*'
            },
            data: payload,
        })
        .then( response => {
            alert("Transaction Saved")
            this.clearForm()
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Note already exist. Enter a different name"})
            }
        })
         this.backendTransactions()
     }

     clearForm() {
        this.setState({description: ""})
    }

    showTransactions = (notes) => {
        var searchTemp = this.state.search
       // var notes = this.state.retrievedNotes
        if (this.state.search === "") {
            return notes.map((transaction, ind) => {
                var d = new Date(transaction.date)
                return <tr key={ind}>
                    <td >{ind+1}</td>
                    <td>{d.toLocaleString('en-US', { timeZone: "Africa/Douala" })} </td>
                    <td>{transaction.type}</td>
                    <td>{transaction.employee.lastname + " " + transaction.employee.firstname}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.amount}</td>
                    <td>{/*transaction.associatedEmployee.lastname + " " + transaction.associatedEmployee.firstname*/}</td>
                </tr>
            })
        } else {
            return notes.map((transaction, ind) => {
                var d = new Date(transaction.date)
                if (transaction.employee.lastname.toUpperCase().includes(searchTemp.toUpperCase()) || transaction.employee.firstname.toUpperCase().includes(searchTemp.toUpperCase())) {
                    var d = new Date(transaction.date)
                    return <tr key={ind}>
                        <td >{ind+1}</td>
                        <td>{d.toLocaleString('en-US', { timeZone: "Africa/Douala" })} </td>
                        <td>{transaction.type}</td>
                        <td>{transaction.employee.lastname + " " + transaction.employee.firstname}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.amount}</td>
                        <td>{/*transaction.associatedEmployee.lastname + " " + transaction.associatedEmployee.firstname*/}</td>
                </tr>
                }
                
            })
        }
        
    }
    componentDidMount() {
        this.backendTransactions()
        this.backendEmployees()
    }
    
    backendTransactions = () => {
        axios({
            url: url+"/v1/api/transaction/transactions",
            method: "GET",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*',
                'ngrok-skip-browser-warning': '*'
            },
        })
        .then( response => {
            console.log(response.data.reverse())
            this.setState({retrievedTransactions: response.data.reverse()})          
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


     render() {
        // Get the current page of sales
        const currentTransactions = this.getCurrentTransactions();

        // Calculate the total number of pages
        const { retrievedTransactions, itemsPerPage } = this.state;
        const totalPages = Math.ceil(retrievedTransactions.length / itemsPerPage);

        // Generate the page numbers
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
        }

         return  <form onSubmit={this.saveTransaction}>
         <div className='container'>
             <div className='card'>
                 <div className='card-header bg-info'>
                     <div className='row'>
                     <div className='col-3'><h4>Store Transaction</h4></div>
                     <div className='col-3'></div>
                     <div className='col-3'> <button type = 'button' className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                     <div className='col-3'> <button type='submit' className='form-control bg-success' > Save</button></div>
                    </div>
                 </div>
                 <div className='card-body'>
                     
                    
                     <div className='row '>
                            <div className='col-2'>
                                <label htmlFor=""> Transaction_Type:</label>
                            </div>
                            <div className='col-3'>
                                <select name="transactionType" className='form-control' onChange={this.handleChange}  required>
                                     <option value=''></option>
                                     <option value='Bank Deposit'>Bank Deposit</option>
                                     <option value='Momo Transfer- Recieved'>Momo Transfer- Recieved</option>
                                     <option value='Momo Transfer- Sent'>Momo Transfer- Sent</option>
                                     <option value='Employee Pay'>Employee Pay</option>
                                     <option value='Store Expenditure'>Store Expenditure</option>
                                </select>
                             </div>
                             <div className='col-1'>
                                <label htmlFor=""> Amount:</label>
                            </div>
                            <div className='col-2'>
                                <input type="number" className='form-control' name='amount' onChange={this.handleChange} value={this.state.amount} required />
                             </div>
                             <div className='col-1'>
                                <label htmlFor=""> Employee:</label>
                            </div>
                            <div className='col-2'>
                                <select name="associatedEmployee" className='form-control' onChange={this.handleChange}  >
                                    <option value=''></option>
                                    {this.populateOptions()}
                                </select>
                             </div>
                     </div>
                     <div className='row'>
                            <div className='col-2'>
                                <label htmlFor="">Description:</label>
                            </div>
                            <div className='col-10'>
                            <textarea className='form-control' name='description' rows="3" placeholder="Enter any useful info" onChange={this.handleChange} value={this.state.description}></textarea>
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
                                 <th>Date</th>
                                 <th>Transaction Type</th>
                                 <th>Performed By</th>
                                 <th> Description</th>
                                 <th>Amount</th>
                                 <th>Paid To (Employee)</th>
                             </tr>
                         </thead>
                         <tbody style={{ whiteSpace: 'pre-wrap' }}>
                             {this.showTransactions(currentTransactions)}
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
         </form>
     }
}