import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'

export default class AddCustomer extends React.Component {
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
            retrievedCustomers: []
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

     saveCustomer = () => {
         let categoryId = this.state.retrievedCustomers.filter( (item,ind) => {
             if (item.name === this.state.category) {
                 return item
             }
         })
         let payload = {
             id: 0,
             firstname: this.state.firstname,
             lastname: this.state.lastname,
             phone: this.state.phone,
             email: this.state.email,
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
        axios({
            url: "http://localhost:8080/v1/api/customer/createCustomer",
            method: "POST",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*'
            },
            data: payload,
        })
        .then( response => {
            alert("customer Saved")
            this.clearForm()
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Item name already exist. Enter a different name"})
            }
        })
         this.backendCustomers()
     }

     clearForm() {
        this.setState({firstname: "", lastname:"", phone:"",email:"",street:"",suite:"",city:"",state:"",zip:""})
    }

    showCustomers = () => {
        var searchTemp = this.state.search
        if (this.state.search === "") {
            return this.state.retrievedCustomers.map((customer, ind) => {
                return <tr key={ind}>
                    <td >{ind+1}</td>
                    <td>{customer.firstname} {customer.lastname} </td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.street}, {customer.suite} {customer.city} {customer.state} {customer.zip}</td>
                </tr>
            })
        } else {
            return this.state.retrievedCustomers.map((customer, ind) => {
                if (customer.firstname.includes(searchTemp) || customer.lastname.includes(searchTemp) || customer.phone.includes(searchTemp)) {
                    return <tr key={ind}>
                    <td >{ind+1}</td>
                    <td>{customer.firstname} {customer.lastname} </td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.street}, {customer.suite} {customer.city} {customer.state} {customer.zip}</td>
                </tr>
                }
                
            })
        }
        
    }
    componentDidMount() {
        this.backendCustomers()
    }
    
    backendCustomers = () => {
        axios({
            url: "http://localhost:8080/v1/api/customer/customers",
            method: "GET",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*'
            },
        })
        .then( response => {
            this.setState({retrievedCustomers: response.data})          
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
                     <div className='col-3'><h4>Add Customer</h4></div>
                     <div className='col-3'></div>
                     <div className='col-3'> <button className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                     <div className='col-3'> <button type='submit' className='form-control bg-success' onClick={this.saveCustomer} > Save</button></div>
                    </div>
                 </div>
                 <div className='card-body'>
                     
                    <div className='row'>
                        <div className='col-2'>
                            <label htmlFor="">Customer_Info:</label>
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
                            <label htmlFor="">Customer_Address:</label>
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
                                 <th>Name</th>
                                 <th>Phone Number</th>
                                 <th>Email</th>
                                 <th>Address</th>
                                 <th>Actions</th>
                             </tr>
                         </thead>
                         <tbody>
                             {this.showCustomers()}
                         </tbody>
                     </table>
                 </div>
             </div>
         </div>
     }
}