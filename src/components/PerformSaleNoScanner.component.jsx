import React, { Component } from "react";
import BarcodeReader from "react-barcode-reader";
import { Stepper, Step } from "react-form-stepper";
import axios from 'axios'
import {Modal,Button} from 'react-bootstrap'
import {url} from '../config/url.js';

export default class PerformSaleNoScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      cart: [],
      customers: [],
      stock: [],
      customer: null,
      foundCustomer: null,
      cartTotal: 0,
      showEditPriceModal: false,
      showFinalizeSaleModal: false,
      showSearchCustomerModal: false,
      currentItem: { item: { sellingPrice: 0 } },
      newSellingPrice: 0,
      customerPhoneNumber: "",
      customerSearchError: "",
      lastSale: {},
      retrievedCustomers: []
      
    };
  }
  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      ...this.state,
      [name]: value,
    });
    console.log(this.state);
  };

  //Start of Modal handlers
  handleShowEditPriceModal = (item) => {
    console.log("** in handle show")
    this.setState({ ...BarcodeReader, showEditPriceModal: true, currentItem: item })
  }
  handleCloseEditPrice = () => {
    this.setState({...BarcodeReader, showEditPriceModal: false})
  }
  handleShowFinalizeSaleModal = () => {
    this.setState({ ...BarcodeReader, showFinalizeSaleModal: true})
  }
  handleCloseFinalizeSale = () => {
    this.setState({...BarcodeReader, showFinalizeSaleModal: false})
  }
  handleShowSearchCustomerModal = () => {
    this.setState({ ...BarcodeReader, showSearchCustomerModal: true})
  }
  handleCloseSearchCustomer = () => {
    this.setState({ ...BarcodeReader, showSearchCustomerModal: false })
    
  }
  //End of Modal handlers

  handleError = (err) => {
    console.error(err);
  };

  getStock = async () => {
     await axios({
      url: url+"/v1/api/itemInventory/stock",
      method: "GET",
      headers: {
         // authorization: "",
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '*'
      },
      })
       .then(response => {
          this.setState({stock: response.data})
      })
      .catch(err => { 
          //const code = err.response.status
          console.error(err)
      })
  }
  showStock =  () => {

    var stock = this.state.stock
    // console.log('stock')
    // console.log(stock)

    return stock.map((stck,ind) => {
      if (stck.currentStock !== 0) {
        return <tr key={ind}>
        <td  >{ind + 1}</td>
        <td >{stck.item.category.name}</td>
        <td >{stck.shipmentDate}</td>
        <td value={stck.item.name}>{stck.item.name}</td>
        <td>{stck.item.model}</td>
        <td value={stck.item.description}>{stck.item.description}</td>
        <td value={stck.currentStock}>{stck.currentStock}</td>
        <td> <button className='button form-control bg-success' onClick={()=>this.addToCart(stck)}>+</button> </td>
      </tr>
      }
      
    })

  }

  addToCart = async (itemStock) => {
    
    var cart = this.state.cart
    var present = false

    var tempCart = cart.map((stckItm) => {
      if (itemStock.item.name === stckItm.item.name && itemStock.shipmentDate === stckItm.shipmentDate) {
        present = true
        console.log("itemStock: ", itemStock)
        console.log("item found: ", present)
        console.log("stckItm",stckItm)

        var cartQuantity = stckItm.cartItemQty
        console.log("cartQuantity", cartQuantity)
        if (cartQuantity < stckItm.currentStock) {
          cartQuantity = stckItm.cartItemQty + 1
          console.log("cartQuantity", cartQuantity)
        }
        stckItm['cartItemQty'] = cartQuantity
        stckItm['cartItemPrice'] = stckItm.cartItemPrice
      }
      return stckItm
    })
    
    if (present === false) {
      var tempItem = { ...itemStock }
      tempItem.cartItemQty = 1
      tempItem.cartItemPrice = itemStock.item.sellingPrice
      tempCart.push(tempItem)
    }
    await this.setState({ cart: tempCart })
    this.calculateCartTotal()
  }

  showCart = () => {
    var cart = this.state.cart
    return cart.map((cartItem, ind) => {
      
      return <tr key={ind}>
        <td >{cartItem.cartItemQty} - </td>
        <td >{cartItem.item.name}</td>
        <td >{cartItem.item.category.name}</td>
        <td >{cartItem.item.description}</td>
        <td >{cartItem.shipmentDate}</td> 
        <td> {cartItem.cartItemPrice}</td>
        <td> {cartItem.cartItemPrice * cartItem.cartItemQty}</td>
        <td> <button className='button form-control bg-danger' onClick={()=>this.removeFromCart(cartItem)} >X</button></td>
        <td> <button className='button form-control bg-warning' onClick={()=>this.handleShowEditPriceModal(cartItem)} >Edit Price</button></td>
      </tr>
    })
  }

  componentDidMount = () => {
    this.getStock()
    this.backendCustomers()
  }

  editPrice = () => {
    var cartTemp = this.state.cart.filter((cartItm) => {
      if (cartItm.item.name === this.state.currentItem.item.name && cartItm.shipmentDate === this.state.currentItem.shipmentDate ) {
        cartItm['cartItemPrice'] = this.state.newSellingPrice
        console.log("edit price for itm", cartItm)
        console.log(" cart", this.state.cart)
        return cartItm
       }
      else return cartItm
    })
    this.setState({ cart: cartTemp })
    this.handleCloseEditPrice()
    this.calculateCartTotal()
  }
  

  removeFromCart = (cartItem) => {
    var cartTemp = this.state.cart.filter((cartItm, ind) => {
      if (cartItem.name === cartItm.name && cartItem.shipmentDate === cartItm.shipmentDate) {
        cartItem.cartItemQty = 0
       }
      else return cartItm
    })
    this.setState({ cart: cartTemp })
    this.calculateCartTotal()
  }

  calculateCartTotal = () => {
    var cartTotalTemp = 0
    this.state.cart.map((cartItm) => {
      cartTotalTemp = cartTotalTemp + (cartItm.cartItemQty*cartItm.cartItemPrice)
    })
    this.setState({cartTotal: cartTotalTemp})
  }

  finalizeSale = () => {
    if (this.state.cart.length == 0) {
      return <h4> Cart is empty</h4>
    } 
    else {
      return <h4>Are you sure you want to proceed with sale?</h4>
    }
  }

  findCustomerByPhoneNumber = async (phoneNum) => {
    
    await axios({
      url: url+"/v1/api/customer/" + this.state.customerPhoneNumber,                            
      method: "GET",                   
      headers: { 
        //authorization: "", 
        'Access-Control-Allow-Origin': '*' ,
        'ngrok-skip-browser-warning': '*'
      }
    })
      .then(response => {
        console.log("here",response.data)
        if (response.data === null || response.data === "") {
          
          this.setState({customerSearchError: "Customer not found"})
        } else {
          this.setState({ foundCustomer: response.data })
        }
        
      })
      .catch(err => {
        const code = err.response.status
        if (code === 409) {
          this.setState({ error: "Item name already exist. Enter a different name" })
        }
      })
    
  }
  backendCustomers = () => {
    axios({
        url: url+"/v1/api/customer/customers",
        method: "GET",
        headers: {
            authorization: "",
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': '*'
        },
    })
    .then( response => {
        this.setState({retrievedCustomers: response.data.reverse()})          
    })
    .catch(err => { 
        const code = err.response.status
        if (code === 409) {
            this.setState({error:"Error occurred"})
        }
    } )
}
  showFoundCustomer = () => {
    var foundCustomer = this.state.foundCustomer
   // console.log("customer", this.state.customer)
   // console.log("foundcustomer", this.state.foundCustomer)

    if (foundCustomer === null) {
      return <p></p>
    }
    if (foundCustomer === "") {
      return <p></p>
    }
    else {
        return <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{foundCustomer.firstname}</td>
                <td>{foundCustomer.lastname}</td>
                <td>{foundCustomer.phone}</td>
                <td>{foundCustomer.email}</td>
                <td><Button variant="success" onClick={()=>this.selectCustomer(foundCustomer)}>Select Customer</Button></td>
              </tr>
            </tbody>
          </table>
      </div>
    }
  }

  selectCustomer = async (foundCustomer) => {
    await this.setState({ customer: foundCustomer })
    this.setState({ foundCustomer: null })
    this.handleCloseSearchCustomer()
  }

  displayCustomerInfo = () => {
    var cus = this.state.customer
    if (cus != null) {
      return <div >
        <div ><label>{cus.firstname} {cus.lastname} </label></div>
        <div ><label> {cus.phone} </label></div>
       </div>
    }
  }

  saveSale = () => {
    const d = new Date();
    var date = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDay()
    var cartTemp = this.state.cart
    var payload = {
      cart: cartTemp,
      employee: {id:1},
      customer: this.state.customer,
      salesDate: date,
      total: this.state.cartTotal
    }
    console.log(payload)
     axios({
      url: url+"/v1/api/itemInventory/performSaleNS",
      method: "POST",
      responseType: "application/json",
      headers: {
         // authorization: "",
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '*'
      },
      data: payload,
     })
       .then(response => {
         var confirmationCode = response.data
         var tempLastSale = payload
         tempLastSale.confirmationCode = confirmationCode

         console.log(response.data)
         this.setState({ cart: [], customer: {}, lastSale: tempLastSale, cartTotal:0 })
         this.getStock()
         this.handleCloseFinalizeSale()

          
      })
      .catch(err => {
        const code = err.status
        console.error(err)
        //  completed = false;
          if (code === 409) {
              this.setState({ error: "Item name already exist. Enter a different name" })
          }
      })
  }


  render() {
    return (
      <div className="card">

        <div className="row">
          <div className="col-6">
            <div className="card-header bg-info">
              <div className="row">
                <div className="col-4"><h4>Perform Sale</h4></div>
                <div className="col-8"><input type="text" placeholder="Type item make or model to search" name='search' value={this.state.search} onChange={this.handleChange} className="form-control" /></div>
              </div>
              
            </div>
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Shipment Date</th>
                    <th>Name</th>
                    <th>Model</th>
                    <th>Item Description</th>
                    <th>Stock</th>
                    <th>Add to Cart</th>
                  </tr>
                </thead>
                <tbody>
                  {this.showStock()}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-6">
            <div className="card-header bg-info">
              <div className="row">
                <div className="col-6">
                  <h4>Cart Total: {this.state.cartTotal}</h4>
                  {this.displayCustomerInfo()}
                </div>
                <div className="col-6">
                  <Button variant="secondary" onClick={this.handleShowSearchCustomerModal}>Add Customer Info</Button>
                  <Button variant="secondary" onClick={this.handleShowFinalizeSaleModal}>Finalize Sale</Button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Qty</th>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Shipment_Date</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.showCart()}
                </tbody>
              </table>
            </div>
          </div>
 
        </div>

        <Modal show={this.state.showEditPriceModal} onHide={this.handleCloseEditPrice} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Item Price Change</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row ">
                <div className="col-6 "><label>Recommended Selling Price:</label></div>
                <div className="col-6"><label>{ this.state.currentItem.item.sellingPrice}</label></div> </div>
            <div className="row">
                <div className="col-6"><label>New Selling Price:</label></div>
                <div className="col-6"><input type="Number" placeholder="Enter new selling price" name='newSellingPrice'  onChange={this.handleChange} className="form-control" /></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseEditPrice}>
              Close
            </Button>
            <Button variant="primary" onClick={this.editPrice}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showSearchCustomerModal} onHide={this.handleCloseSearchCustomer} backdrop="static" size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Search Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
                  <div className="col-3"><label>Enter Phone Number:</label></div>
                  <div className="col-6"><input type="text" placeholder="Phone number" name='customerPhoneNumber'  onChange={this.handleChange} className="form-control" /></div>
                  <div className="col-3"><Button variant="primary" onClick={this.findCustomerByPhoneNumber}>Search</Button></div>
            </div>
            <div className="row">
              <div className="col-4"></div>
              <div className="col-6"><p className="text-danger">{ this.state.customerSearchError}</p></div>
            </div>
            {this.showFoundCustomer()}
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseSearchCustomer}>
              close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showFinalizeSaleModal} onHide={this.handleCloseFinalizeSale} backdrop="static" >
          <Modal.Header closeButton>
            <Modal.Title>Finalizing Sale</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.finalizeSale()}
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.handleCloseFinalizeSale}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.saveSale}>
              Save Sale
            </Button>
          </Modal.Footer>
        </Modal>
        
      </div>
    );
  }
}
