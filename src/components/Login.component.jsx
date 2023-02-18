import React, { PureComponent } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import {withRouter,Link} from 'react-router-dom'

class LoginComp extends PureComponent {
     constructor(props) {
        super(props) 
        this.state = {
            username: "",
            password: "",
            employee: "",
            error: ""
            
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


     clearForm() {
        this.setState({firstname: "", lastname:"", phone:"",email:"",street:"",suite:"",city:"",state:"",zip:""})
    }


    componentDidMount() {
      document.title = 'login'
    }
    
    login = () => {
        const {history} = this.props
        axios({
            url: "http://localhost:8080/v1/api/login",
            method: "POST",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*'
            },
            data: {
                username: this.state.username,
                password: this.state.password
            },
        })
        .then( response => {
            this.setState({ retrievedCustomers: response.data })
            history.push('/dashboard')
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 400) {
                this.setState({ error: "Wrong username or password" })
                
            }
        } )
    }

     render() {
         return <div className="container mt-0">
             <div className='card'>
                 <div className='card-header bg-info'>
                     <div className='row'>
                        <div className='col-8'><h4>Login</h4></div>
                    </div>
                 </div>
                 <div className='card-body'>
                    <div className='row'>
                        <div className='col-2'>
                            <label htmlFor=""></label>
                        </div>
                         <div className='col-8'>
                             <label htmlFor="" className='text-danger'>{ this.state.error}</label>
                        </div>
                     </div>
                    <div className='row'>
                        <div className='col-2'>
                            <label htmlFor="">Username:</label>
                        </div>
                        <div className='col-8'>
                            <input type="text" className='form-control' name='username' placeholder="username" onChange={this.handleChange} value={this.state.username} />
                        </div>
                     </div>
                     <div className='row'>
                        <div className='col-2'>
                            <label htmlFor="">Password:</label>
                        </div>
                        <div className='col-8'>
                            <input type="password" className='form-control' name='password' placeholder="password" onChange={this.handleChange} value={this.state.password} />
                        </div>
                     </div>   
                 </div>
                 <div className='card-footer'>
                    <div className='row'>
                        <div className='col-3'></div>
                        <div className='col-3'> <button className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                        <div className='col-3'> <button type='submit' className='form-control bg-success' onClick={this.login} > Login</button></div>
                    </div>
                 </div> 
             </div>
             
         </div>
     }
}

export default withRouter(LoginComp);