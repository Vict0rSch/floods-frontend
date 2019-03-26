import React, { Component } from 'react';
import { Col, Row } from 'antd';
import { Input } from 'antd';
import Script from 'react-load-script';
import uuid4 from 'uuid/v4';

class Right extends Component {

    state = {
        data: [],
        value: undefined,
        loading: false,
        sessiontoken: uuid4(),
        address: null
    }

    handleChange = (ev) => {
        const value = ev.target.value;
        let ad = this.state.address;
        if (!value) {
            ad = null;
        }
        this.setState({
            value,
            address: ad
        })
    }

    // handleChange = (value) => {
    //     this.setState({ value });
    // }

    handleScriptLoad = () => {

        // Declare Options For Autocomplete 
        var options = { types: ["address"] };

        // Initialize Google Autocomplete 
        /*global google*/
        this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("autocomplete"),
            options);
        // Fire Event when a suggested name is selected
        this.autocomplete.addListener("place_changed",
            this.handlePlaceSelect);
    }

    handlePlaceSelect = () => {

        // Extract City From Address Object
        let addressObject = this.autocomplete.getPlace();
        let address = addressObject.address_components;

        // Check if address is valid
        if (address) {
            // Set State
            console.log({ addressObject });
            this.setState(
                {
                    value: addressObject.formatted_address,
                    address: addressObject,
                }
            );
        }
    }

    render() {

        console.log(`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY || ""}&libraries=places&sessiontoken=${this.state.sessiontoken}`);

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
                        <a
                            href={ this.state.address.url }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={ { fontSize: '1rem' } }
                        >
                            { this.state.address.formatted_address }
                        </a>
                        :
                        ""
                }
            </Row>
        </Col>
    }

}


export default Right;