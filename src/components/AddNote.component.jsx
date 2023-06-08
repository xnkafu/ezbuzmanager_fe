import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import {url} from '../config/url.js';
import Cookies from 'universal-cookie';

export default class AddNote extends React.Component {
     constructor(props) {
        super(props) 
        this.state = {
            description: "",
            employee: {},
            date: "",
            retrievedNotes: [],
            search:'',
            currentPage: 1, // The current page number
            itemsPerPage: 5 // The number of items to show per page
         }
         this.handleChange = this.handleChange.bind(this)
         this.clearForm = this.clearForm.bind(this)
     }

     getCurrentNotes() {
        const { retrievedNotes, currentPage, itemsPerPage } = this.state;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return retrievedNotes.slice(indexOfFirstItem, indexOfLastItem);
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

     saveNote = async () => {
        const cookies = new Cookies();
        const user = cookies.get('user');
        const d = new Date();

         let payload = {
             description: this.state.description,
             employee: user,
             date: d
            
        }
        console.log("payload is ")
        console.log(payload)
        await axios({
            url: url+"/v1/api/note/createNote",
            method: "POST",
            headers: {
              //  authorization: "",
                'Access-Control-Allow-Origin': '*',
                'ngrok-skip-browser-warning': '*'
            },
            data: payload,
        })
        .then( response => {
            alert("Note Saved")
            this.clearForm()
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Note already exist. Enter a different name"})
            }
        })
         this.backendNotes()
     }

     clearForm() {
        this.setState({description: ""})
    }

    showNotes = (notes) => {
        var searchTemp = this.state.search
       // var notes = this.state.retrievedNotes
        if (this.state.search === "") {
            return notes.map((note, ind) => {
                var d = new Date(note.date)
                return <tr key={ind}>
                    <td >{ind+1}</td>
                    <td>{d.toLocaleString('en-US', { timeZone: "Africa/Douala" })} </td>
                    <td>{note.employee.lastname + " " + note.employee.firstname}</td>
                    <td>{note.description}</td>
                </tr>
            })
        } else {
            return notes.map((note, ind) => {
                var d = new Date(note.date)
                if (note.employee.lastname.toUpperCase().includes(searchTemp.toUpperCase()) || note.employee.firstname.toUpperCase().includes(searchTemp.toUpperCase())) {
                    var d = new Date(note.date)
                    return <tr key={ind}>
                        <td >{ind+1}</td>
                        <td>{d.toLocaleString('en-US', { timeZone: "Africa/Douala" })} </td>
                        <td>{note.employee.lastname + " " + note.employee.firstname}</td>
                        <td>{note.description}</td>
                </tr>
                }
                
            })
        }
        
    }
    componentDidMount() {
        this.backendNotes()
    }
    
    backendNotes = () => {
        axios({
            url: url+"/v1/api/note/notes",
            method: "GET",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*',
                'ngrok-skip-browser-warning': '*'
            },
        })
        .then( response => {
            this.setState({retrievedNotes: response.data.reverse()})          
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
        const currentNotes = this.getCurrentNotes();

        // Calculate the total number of pages
        const { retrievedNotes, itemsPerPage } = this.state;
        const totalPages = Math.ceil(retrievedNotes.length / itemsPerPage);

        // Generate the page numbers
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
        }

         return <div className='container'>
             <div className='card'>
                 <div className='card-header bg-info'>
                     <div className='row'>
                     <div className='col-3'><h4>Add New Work Note</h4></div>
                     <div className='col-3'></div>
                     <div className='col-3'> <button className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                     <div className='col-3'> <button type='submit' className='form-control bg-success' onClick={this.saveNote} > Save</button></div>
                    </div>
                 </div>
                 <div className='card-body'>
                     
                    
                     <div className='row'>
                        <div className='col-2'>
                            <label htmlFor="">Work Description:</label>
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
                                 <th>Date</th>
                                 <th>Employee Name</th>
                                 <th> Description</th>
                             </tr>
                         </thead>
                         <tbody>
                             {this.showNotes(currentNotes)}
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