import React, { Component } from 'react';
import { Col, Row } from 'antd';
import { Input } from 'antd';
import Script from 'react-load-script';
import uuid4 from 'uuid/v4';

function validateResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

class Right extends Component {

    state = {
        value: "72 rue Jouffroy d'Abbans paris",
        loading: false,
        sessiontoken: uuid4(),
        address: null,
        src: "",
        noImage: false
    }

    resetState = () => {
        this.setState({
            loading: false,
            value: null,
            src: null,
            address: null,
            noImage: null,
        })
    }

    handleChange = (ev) => {
        const value = ev.target.value;
        if (!value) {
            this.resetState();
        } else {
            this.setState({
                value
            })
        }
    }

    handleScriptLoad = () => {

        // Declare Options For Autocomplete 
        var options = { types: ["address"] };

        // Initialize Google Autocomplete 
        /*global google*/
        this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("autocomplete"),
            options);
        // Fire Event when a suggested name is selected
        this.autocomplete.addListener(
            "place_changed",
            this.handlePlaceSelect
        );
        console.log(this.inputElement);
        // this.inputElement.dispatchEvent(new Event('change', { bubbles: true }))
    }

    handlePlaceSelect = () => {

        let addressObject = this.autocomplete.getPlace();
        let address;
        if (addressObject) {
            address = addressObject.address_components;
        }
        // Check if address is valid
        if (address) {
            this.setState({
                loading: true
            })
            // Set State
            fetch(`http://localhost:5000/address/v1/${addressObject.formatted_address}`)
                .then(validateResponse)
                .then(response => response.blob())
                .then(blob => {
                    this.setState({
                        src: URL.createObjectURL(blob),
                        noImage: false,
                        loading: false,
                    })
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        noImage: true,
                        loading: false,
                    })
                })
            this.setState(
                {
                    value: addressObject.formatted_address,
                    address: addressObject,
                }
            );
        }
    }

    render() {

        return <Col
            xs={ 24 }
            sm={ 12 }
            style={ {
                fontSize: '3rem',
                color: "white",
                padding: 20,
            } }
        >
            <Script
                url={ `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY || ""}&libraries=places&sessiontoken=${this.state.sessiontoken}` }
                onLoad={ this.handleScriptLoad }
            />
            <Row
                align="middle"
                justify="center"
                type="flex"
            >
                <Input
                    ref={ input => this.inputElement = input }
                    style={ { width: '90%' } }
                    size="large"
                    id="autocomplete"
                    onChange={ this.handleChange }
                    value={ this.state.value }
                    allowClear
                ></Input>
            </Row>

            <Row
                align="middle"
                justify='center'
                type="flex"
                style={ { paddingTop: 8, minHeight: 32 } }
            >
                {
                    this.state.address ?
                        this.state.noImage ?
                            `No Street View image available for ${this.state.value}`
                            :
                            this.state.loading ?
                                "Loading..."
                                :
                                <div>
                                    {/* <a
                                    href={ this.state.address.url }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={ { fontSize: '1rem' } }
                                >
                                    { this.state.address.formatted_address }
                                </a>
                                <br /> */}
                                    <img
                                        alt={ `Street View of ${this.state.value}` }
                                        src={ this.state.src }
                                        style={ {
                                            height: "100%",
                                            width: "100%"
                                        } }
                                    >
                                    </img>
                                </div>
                        :
                        ""
                }
            </Row>
        </Col>
    }

}


export default Right;
