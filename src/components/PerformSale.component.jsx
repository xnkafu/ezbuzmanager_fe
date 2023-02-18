import React, { Component } from "react";
import BarcodeReader from "react-barcode-reader";
import { Stepper, Step } from "react-form-stepper";

export default class PerformSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScan: "",
      scans: [],
      customers: [],
      customer: {},
      activeStep: 1,
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
  handleScan = (data) => {
    this.setState({ scans: this.state.scans.concat(data) });
    console.log("scanssss");
    console.log(this.state.scans);
  };
  handleError = (err) => {
    console.error(err);
  };
  handleChar = (char) => {
    console.log(char);
    };
    

    handleNextStep = () => {
        this.setState({activeStep: this.state.activeStep+1})
    }
    handlePreviousStep = () => {
        if (this.state.activeStep < 1) {
            this.setState({activeStep: this.state.activeStep-1})
        }
        
    }
  render() {
    return (
      <div className="card">
        <BarcodeReader
          onError={this.handleError}
          onScan={this.handleScan}
          avgTimeByChar={1}
        />

        <div className="card-header bg-info">
          <h4>Perform Sale</h4>
        </div>
        <div className="card-body">
           
          <div className="row">
            <div className="col-1">
              <label htmlFor="">Current Scan:</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                name="currentScan"
                onChange={this.handleChange}
                value={this.state.currentScan}
                autoFocus
              />
            </div>
          </div>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Barcode</th>
              <th>Item Description</th>
              <th>Item comments</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}
