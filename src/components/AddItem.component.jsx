import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'

export default class AddItem extends React.Component {
     constructor(props) {
        super(props) 
        this.state = {
            name: "",
            make: "",
            model: "",
            releaseYear: "",
            description: "",
            category: "",
            purchasePrice: "",
            sellingPrice: "",
            error: "",
            retrievedCategories: []
         }
         this.handleChange = this.handleChange.bind(this)
         this.clearForm = this.clearForm.bind(this)
         this.saveItem = this.saveItem.bind(this)
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

     saveItem() {
         let categoryId = this.state.retrievedCategories.filter( (item,ind) => {
             if (item.name === this.state.category) {
                 return item
             }
         })
         let payload = {
             id: 0,
            name: this.state.name,
            description: this.state.description,
            make: this.state.make,
            model: this.state.model,
            releaseYear: this.state.releaseYear,
            category: categoryId[0],
            purchasePrice: this.state.purchasePrice,
            sellingPrice: this.state.sellingPrice,
        }
        console.log("payload is ")
        console.log(payload)
        axios({
            url: "http://localhost:8080/v1/api/item/createItem",
            method: "POST",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*'
            },
            data: payload,
        })
        .then( response => {
            alert("Category Saved")
            this.clearForm()
        })
        .catch(err => { 
            const code = err.response.status
            if (code === 409) {
                this.setState({error:"Item name already exist. Enter a different name"})
            }
        } )
     }

     clearForm() {
        this.setState({name: "", description:"", category:"",make:"",model:"",releaseYear:0,purchasePrice:0,sellingPrice:0})
    }

    populateOptions =  () => {
         const categories = this.state.retrievedCategories
         return categories.map((item,ind) => {
             return <option key={ind} value={item.name}>{item.name}</option>
         })
    }
    componentDidMount() {
        axios({
            url: "http://localhost:8080/v1/api/category/categories",
            method: "GET",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*'
            },
        })
        .then( response => {
            this.setState({retrievedCategories: response.data})          
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
                    <h4>Register Item Type</h4>
                 </div>
                 <div className='card-body'>
                    <div className='row'>
                            <div className='col-3'>
                                <label htmlFor=""> Category:</label>
                            </div>
                            <div className='col-7'>
                            <select name="category" className='form-control' onChange={this.handleChange} value={this.state.category}>
                                {this.populateOptions()}
                            </select>
                             </div>
                        </div>
                    <div className='row'>
                            <div className='col-4'></div>
                            <div className='col-7'>
                                <label className='text-danger'>{this.state.error}</label>
                            </div>
                        </div>
                    <div className='row'>
                        <div className='col-3'>
                            <label htmlFor="">Item Name:</label>
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
                    <div className='row'>
                        <div className='col-3'>
                            <label htmlFor=""> Make:</label>
                        </div>
                        <div className='col-7'>
                            <input type="text" className='form-control' name='make' onChange={this.handleChange} value={this.state.make} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-3'>
                            <label htmlFor=""> Model:</label>
                        </div>
                        <div className='col-7'>
                            <input type="text" className='form-control' name='model' onChange={this.handleChange} value={this.state.model} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-3'>
                            <label htmlFor=""> Release Year:</label>
                        </div>
                        <div className='col-7'>
                            <input type="number" className='form-control' name='releaseYear' onChange={this.handleChange} value={this.state.releaseYear} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-3'>
                            <label htmlFor=""> Purchase Price:</label>
                        </div>
                        <div className='col-7'>
                            <input type="number" className='form-control' name='purchasePrice' onChange={this.handleChange} value={this.state.purchasePrice} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-3'>
                            <label htmlFor=""> Selling Price:</label>
                        </div>
                        <div className='col-7'>
                            <input type="number" className='form-control' name='sellingPrice' onChange={this.handleChange} value={this.state.sellingPrice} />
                        </div>
                    </div>
                 </div>
                 <div className='card-footer'>
                    <div className='row'>
                        <div className='col-3'></div>
                        <div className='col-3'> <button className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                        <div className='col-3'> <button type='submit' className='form-control bg-success' onClick={this.saveItem} > Save</button></div>
                    </div>
                 </div>
             </div>
         </div>
     }
}