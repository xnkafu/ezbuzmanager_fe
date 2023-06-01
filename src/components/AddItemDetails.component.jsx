import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'

export default class AddItemDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            category: "",
            categoryId: "",
            item: "",
            quantity: 0,
            error: "",
            serialNumber: "",
            comment: "",
            retrievedCategories: [],
            retrievedItems: [],
            retrievedShipmentDates: [],
            barcodes: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.clearForm = this.clearForm.bind(this)
        //this.saveItem = this.saveItem.bind(this)
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

    
    saveItem = async () => {
        let categoryTemp = this.state.retrievedCategories.filter((cat, ind) => {
            if (cat.name === this.state.category) {
                return cat
            }
        })
        let itemTemp = this.state.retrievedItems.slice(0).filter((item, ind) => {
            if (item.name === this.state.item) {
                return item
            }
        })
        let payload = {
            id: 0,
            category: categoryTemp,
            item: itemTemp[0],
            quantity: this.state.quantity,
            serialNumber: this.state.serialNumber,
            comment: this.state.comment,
            shipmentDate: this.state.shipmentDate
        }
        console.log('payload')
        console.log(payload)
        console.log(this.state)
       
       // let completed = true
        if (payload.quantity >= 1) {
            for (let i = 1; i <= payload.quantity; i++) {
                await axios({
                    url: "http://localhost:8080/v1/api/itemInventory/createItemInventory",
                    method: "POST",
                    responseType: "blob",
                    headers: {
                        authorization: "",
                        'Access-Control-Allow-Origin': '*'
                    },
                    data: payload,
                })
                    .then(response => {
                        const barcodeInfo = {
                            barcode: URL.createObjectURL(response.data),
                            printStatus: "Pending"
                        }
                        this.setState({ barcodes: this.state.barcodes.concat(barcodeInfo) })
                       // this.wait(1000)
                        //alert(i + " Item detail Saved to Inventory")
                        this.clearForm()
                    })
                    .catch(err => {
                        const code = err.status
                      //  completed = false;
                        if (code === 409) {
                            this.setState({ error: "Item name already exist. Enter a different name" })
                        }
                    })
            }
        }
      //  if (completed) {
       //     alert("Item detail Saved to Inventory")
      //  }
        
        
    }
  
    clearForm() {
        this.setState({ name: "", description: "", category: "",quantity:0 })
    }

    populateCategoryOptions = () => {
        const categories = this.state.retrievedCategories
        return categories.map((cat, ind) => {
            return <option key={ind} value={cat.name}>{cat.name}</option>
        })
    }

    populateItemOptions = () => {
        const items = this.state.retrievedItems
        return items.map((item, ind) => {
            if (ind === 0) { 
                return <option key={ind} >Select Item</option>
            }
            else if (item.category.name === this.state.category) { //revisit
                return <option key={ind} value={item.name /*+ " " + item.model */}>{item.name + " " + item.model}</option>
            }
        })
    }

    populateShipmentDateOptions = () => {
        const shipmentDates = this.state.retrievedShipmentDates
        return shipmentDates.map((shipmentDate, ind) => {
            return <option key={ind} value={shipmentDate.date}>{shipmentDate.date}</option>
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
            .then(response => {
                this.setState({ retrievedCategories: ['',...response.data] })
            })
            .catch(err => {
                const code = err.response.status
                if (code === 409) {
                    this.setState({ error: "Error occurred" })
                }
            })

        axios({
            url: "http://localhost:8080/v1/api/item/items",
            method: "GET",
            headers: {
                authorization: "",
                'Access-Control-Allow-Origin': '*'
            },
        })
            .then(response => {
                this.setState({ retrievedItems: ['',...response.data] })
            })
            .catch(err => {
                const code = err.response.status
                if (code === 409) {
                    this.setState({ error: "Error occurred" })
                }
            })
        axios({
                url: "http://localhost:8080/v1/api/shipmentDate/shipmentDates",
                method: "GET",
                headers: {
                    authorization: "",
                    'Access-Control-Allow-Origin': '*'
                },
            })
                .then(response => {
                    this.setState({ retrievedShipmentDates: ['',...response.data] })
                    console.log(response.data)
                })
                .catch(err => {
                    const code = err.response.status
                    if (code === 409) {
                        this.setState({ error: "Error occurred" })
                    }
                })
    }

    showBarcodes = () => {
        return this.state.barcodes.map((barcodeInfo, ind) => {
            return <tr key={ind}>
                <td >{ind+1}</td>
                <td> <img src={barcodeInfo.barcode} /> </td>
                <td>{barcodeInfo.printStatus}</td>
                <td><button className='form-control bg-success' onClick={this.printBarcode} > Print</button></td>
            </tr>
        })
    }

    printBarcodes = () => {
        alert('print called')
        var tempBarcodes = this.state.barcodes
        var barcode = tempBarcodes[0].barcode
         
        var printable = window.open('', '')
        printable.document.write('<html>')
        printable.document.write('<body style="overflow:hidden; margin:5; text-align:center;">')
        printable.document.write(`<img src=${barcode} style="height:90vh; max-width:100%;"/>`)
        printable.document.write('</body>')
        printable.document.write('</html>')
        printable.document.close()
        console.log('here')
        printable.print()
        
    }

    printBarcode = (div_id) => {
        window.print(div_id)
    }
    render() {
        return <div className='container'>
            <div className='row'>
                <div className='col-6'>
                    <div className='card'>
                    <div className='card-header bg-info'>
                        <div className='row'>
                            <div className='col-7'><h4>Add Item/Items to Inventory</h4></div>
                            <div className='col-5'>
                                <div className='row'>
                                    <div className='col-6'> <button className='form-control bg-danger' onClick={this.clearForm}> Clear</button></div>
                                    <div className='col-6'> <button type='submit' className='form-control bg-success' onClick={this.saveItem} > Save</button></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-3'>
                                <label htmlFor=""> Category:</label>
                            </div>
                            <div className='col-7'>
                                <select name="category" className='form-control' onChange={this.handleChange} value={this.state.category}>
                                    {this.populateCategoryOptions()}
                                </select>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <label htmlFor=""> Item:</label>
                            </div>
                            <div className='col-7'>
                                    <select name="item" className='form-control' onChange={this.handleChange} value={this.state.item}>
                                    {this.populateItemOptions()}
                                </select>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <label htmlFor="">Quantity:</label>
                            </div>
                            <div className='col-7'>
                                <input type="number" className='form-control' name='quantity' onChange={this.handleChange} value={this.state.quantity} required />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <label htmlFor=""> Serial Number:</label>
                            </div>
                            <div className='col-7'>
                                <input type="text" className='form-control' name='serialNumber' onChange={this.handleChange} value={this.state.serialNumber} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <label htmlFor=""> Comment:</label>
                            </div>
                            <div className='col-7'>
                                <input type="text" className='form-control' name='comment' onChange={this.handleChange} value={this.state.comment} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <label htmlFor=""> Shipment Date:</label>
                            </div>
                            <div className='col-7'>
                                <select name="shipmentDate" className='form-control' onChange={this.handleChange} value={this.state.shipmentDate} >
                                    {this.populateShipmentDateOptions()}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='card-footer'>

                    </div>
                </div>
                </div>
                
                <div className='col-6'>
                    <div className='card'>
                        <div className='card-header bg-info'>
                            <div className='row'>
                                <div className='col-8'>
                                    <h4>Print Generated Barcodes</h4>
                                </div>
                                <div className='col-4'>
                                    <button type='submit' className='form-control bg-success' onClick={this.printBarcodes} > Print Barcodes</button>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            <table className='table table-hover'>
                                <thead className='thead-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Barcode</th>
                                        <th>Print Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.showBarcodes()  } 
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}