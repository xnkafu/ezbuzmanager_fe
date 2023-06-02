import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import {url} from '../config/url.js';

export default class AddEmployee extends React.Component {
     constructor(props) {
        super(props) 
        this.state = {
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            dob: "",
            street: "",
            suite: "",
            city: "",
            state: "",
            zip: "",
            error: "",
            search: "",
            ssn: "",
            dob: "",
            username: '',
            password: "",
            role:"",
            retrievedEmployees: []
         }
         this.handleChange = this.handleChange.bind(this)
         this.clearForm = this.clearForm.bind(this)
         //this.getCategories = this.getCategories.bind(this)
     }

     handleChange(event) {
         const value = event.target.value
         const name = event.target.name
         this.setState({
             ...this.state,
             [name]: value
         })
     }

     saveEmployee = async () => {
         
         let payload = {
             id: 0,
             firstname: this.state.firstname,
             lastname: this.state.lastname,
             phone: this.state.phone,
             email: this.state.email,
             dob: this.state.dob,
             ssn: this.state.ssn,
             username: this.state.username,
             password: this.state.password,
             role: this.state.role,
             address: {
                street: this.state.street,
                suite: this.state.suite,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zip,
            }
            
        }
        console.log("payload is ")
        console.log(payload)
       await axios({
            url: "http://10.0.0.175:8080/v1/api/employee/createEmployee",
            method: "POST",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*'
            },
            data: payload,
        })
        .then( response => {
            alert("Employee Saved")
            this.clearForm()
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Item name already exist. Enter a different name"})
            }
        })
         this.backendEmployees()
     }

     clearForm() {
        this.setState({firstname: "", lastname:"", phone:"",email:"",street:"",suite:"",city:"",state:"",zip:"", ssn:"",dob:"",username:'',password:"", role:""})
    }

    showEmployees = () => {
        var searchTemp = this.state.search
        console.log(this.state.retrievedEmployees)
        if (this.state.search === "") {
            return this.state.retrievedEmployees.map((employee, ind) => {
                return <tr key={ind}>
                    <td >{ind+1}</td>
                    <td>{employee.firstname} {employee.lastname} </td>
                    <td>{employee.phone}</td>
                    <td>{employee.email}</td>
                    <td>{employee.address.street}, {employee.address.suite} {employee.address.city} {employee.address.state} {employee.address.zip}</td>
                    <td>{employee.active}</td>
                    <td>{employee.employmentDate}</td>
                </tr>
            })
        } else {
            return this.state.retrievedEmployees.map((employee, ind) => {
                if (employee.firstname.includes(searchTemp) || employee.lastname.includes(searchTemp) || employee.phone.includes(searchTemp)) {
                    return <tr key={ind}>
                    <td >{ind+1}</td>
                    <td>{employee.firstname} {employee.lastname} </td>
                    <td>{employee.phone}</td>
                    <td>{employee.email}</td>
                    <td>{employee.address.street}, {employee.address.suite} {employee.address.city} {employee.address.state} {employee.address.zip}</td>
                    <td>{employee.active}</td>
                    <td>{employee.employmentDate}</td>
                </tr>
                }
                
            })
        }
        
    }
    componentDidMount() {
        this.backendEmployees()
        
    }
    
    backendEmployees = () => {
        axios({
            url: url+"/v1/api/employee/employees",
            method: "GET",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*'
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
         return <div className='container'>
             <div className='card'>
                 <div className='card-header bg-info'>
                     <div className='row'>
                     <div className='col-3'><h4>Add Employee</h4></div>
                     <div className='col-3'></div>
                     <div className='col-3'> <button className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                     <div className='col-3'> <button type='submit' className='form-control bg-success' onClick={this.saveEmployee} > Save</button></div>
                    </div>
                 </div>
                 <div className='card-body'>
                     
                    <div className='row'>
                        <div className='col-2'>
                            <label htmlFor="">Employee_Info:</label>
                        </div>
                        <div className='col-2'>
                            <input type="text" className='form-control' name='firstname' placeholder="firstname" onChange={this.handleChange} value={this.state.firstname} />
                        </div>
                        <div className='col-2'>
                            <input type="text" className='form-control' name='lastname' placeholder="lastname" onChange={this.handleChange} value={this.state.lastname} />
                        </div>
                        <div className='col-2'>
                            <input type="text" className='form-control' name='phone' placeholder="phone" onChange={this.handleChange} value={this.state.phone} />
                        </div>
                        <div className='col-4'>
                            <input type="text" className='form-control' name='email' placeholder="email" onChange={this.handleChange} value={this.state.email} />
                        </div>
                     </div>
                     <div className='row'>
                        <div className='col-2'>
                            <label htmlFor=""> </label>
                        </div>
                        <div className='col-2'>
                            <input type="text" className='form-control' name='ssn' placeholder="ss number" onChange={this.handleChange} value={this.state.ssn} />
                        </div>
                        <div className='col-2'>
                            <input type="text" className='form-control' name='dob' placeholder="date of birth" onChange={this.handleChange} value={this.state.dob} />
                        </div>
                        <div className='col-2'>
                            <input type="text" className='form-control' name='username' placeholder="username" onChange={this.handleChange} value={this.state.username} />
                        </div>
                        <div className='col-3'>
                            <input type="text" className='form-control' name='password' placeholder="temporal password" onChange={this.handleChange} value={this.state.password} />
                         </div>
                         <div className='col-1'>
                            <input type="text" className='form-control' name='role' placeholder="Role" onChange={this.handleChange} value={this.state.role} />
                        </div>
                     </div>
                     <div className='row'>
                        <div className='col-2'>
                            <label htmlFor="">Employee_Address:</label>
                        </div>
                        <div className='col-3'>
                            <input type="text" className='form-control' name='street' placeholder="street" onChange={this.handleChange} value={this.state.street} />
                        </div>
                        <div className='col-1'>
                            <input type="text" className='form-control' name='suite' placeholder="suite" onChange={this.handleChange} value={this.state.suite} />
                        </div>
                        <div className='col-2'>
                            <input type="text" className='form-control' name='city' placeholder="city" onChange={this.handleChange} value={this.state.city} />
                        </div>
                        <div className='col-1'>
                            <input type="text" className='form-control' name='state' placeholder="state" onChange={this.handleChange} value={this.state.state} />
                         </div>
                         <div className='col-1'>
                            <input type="text" className='form-control' name='zip' placeholder="zip" onChange={this.handleChange} value={this.state.zip} />
                        </div>
                     </div>

       
                 </div>
                 
             </div>
             <div className='card'>
                 <div className='card-header bg-dark'>
                     <div className='row'>
                     <div className='col-12'> <input type="text" className='form-control' name='search' placeholder="Search customer list" onChange={this.handleChange} value={this.state.search} /></div>
                 </div>
                 </div>
                 <div className='card-body'>
                     <table className='table table-striped table-bordered table-hover'>
                         <thead className='thead-dark'>
                             <tr>
                                 <th scope='col'>#</th>
                                 <th>Employee Name</th>
                                 <th>Phone Number</th>
                                 <th>Email</th>
                                 <th>Address</th>
                                 <th>Is Active</th>
                                 <th>Employeement_Date</th>
                                 <th>Actions</th>
                             </tr>
                         </thead>
                         <tbody>
                             {this.showEmployees()}
                         </tbody>
                     </table>
                 </div>
             </div>
         </div>
     }
}