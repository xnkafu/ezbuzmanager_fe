import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import {url} from '../config/url.js';

export default class AddCategory extends React.Component {
     constructor(props) {
        super(props) 
        this.state = {
            name: "",
            description: "",
            error: ""
         }
         this.handleChange = this.handleChange.bind(this)
         this.clearForm = this.clearForm.bind(this)
         this.saveCategory = this.saveCategory.bind(this)
     }

     handleChange(event) {
         const value = event.target.value
         const name = event.target.name
         this.setState({
             ...this.state,
             [name]: value
         })
         console.log(this.state)
     }

     saveCategory() {
        axios({
            url: url+"/v1/api/category/createCategory",
            method: "POST",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*'
            },
            data: {
                name: this.state.name,
                description: this.state.description
            },
        })
        .then( response => {
            alert("Category Saved")
            this.clearForm()
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Category name already exist. Enter a different name"})
            }
        } )
     }

     clearForm() {
        this.setState({name: "", description:""})
    }

     render() {
         return <div className='container'>
             <div className='card'>
                 <div className='card-header bg-info'>
                    <h4>Add Category</h4>
                 </div>
                 <div className='card-body'>
                    <div className='row'>
                            <div className='col-4'></div>
                            <div className='col-7'>
                                <label className='text-danger'>{this.state.error}</label>
                            </div>
                        </div>
                    <div className='row'>
                        <div className='col-3'>
                            <label htmlFor="">Category Name:</label>
                        </div>
                        <div className='col-7'>
                            <input type="text" className='form-control' name='name' onChange={this.handleChange} value={this.state.name} required/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-3'>
                            <label htmlFor=""> Description:</label>
                        </div>
                        <div className='col-7'>
                            <input type="text" className='form-control' name='description' onChange={this.handleChange} value={this.state.description} />
                        </div>
                    </div>
                 </div>
                 <div className='card-footer'>
                    <div className='row'>
                        <div className='col-3'></div>
                        <div className='col-3'> <button className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                        <div className='col-3'> <button className='form-control bg-success' onClick={this.saveCategory} > Save</button></div>
                    </div>
                 </div>
             </div>
         </div>
     }
}