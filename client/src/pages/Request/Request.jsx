import React, { Component } from 'react';
import request from 'request';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import '../Main.module.css';

class Request extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bodyType: undefined,
            extras: undefined,
            startDate: new Date(),
            endDate: new Date(),
        };
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        request('http://localhost:3001/vehicle-body-options',
            (error, response) => {
                const x = JSON.parse(response.body);
                this.setState({ bodyType: x });
                console.log(response.body);
            });

        request('http://localhost:3001/vehicle-extras-options',
            (error, response) => {
                const x = JSON.parse(response.body);
                this.setState({ extras: x });
                console.log(response.body);
            });
    }

    handleChangeStart(date) {
        this.setState({
            startDate: date,
        });
    }

    handleChangeEnd(date) {
        this.setState({
            endDate: date,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    handleSubmit(event) {
        // eslint-disable-next-line no-undef
        window.location = 'http://localhost:3000/proposals?type=2&make=toyota&model=prius';
        event.preventDefault();
    }

    render() {
        const {
            bodyType,
            extras,
            startDate,
            endDate,
        } = this.state;
        let bodyTypeOptions = '';
        if (bodyType !== undefined) {
            bodyTypeOptions = bodyType.map(x => <option key={x.id}>{x.description}</option>);
        }

        let extraOptions = '';
        if (extras !== undefined) {
            extraOptions = extras.map(x => (
                <li key={x.id} className="Extras__Item">
                    <input className="Extras__Checkbox" type="checkbox" />
                    <div className="Extras__Text">{x.description}</div>
                </li>
            ));
        }

        return (
            <div>
                <div className="Search__Container Search__Container_HeightRequest">
                    <form className="Search__Form" onSubmit={this.handleSubmit}>

                        {/* Option Vehicle Section */}
                        <p className="Search__Title">Vehicle</p>
                        <div className="Search__LabelGrid">
                            <div>
                                <select className="Search__Label_FullWidth">
                                    <option className="Search__Option_FullWidth">Body Type</option>
                                    {bodyTypeOptions}
                                </select>
                            </div>
                            <div>
                                <select className="Search__Label_FullWidth">
                                    <option className="Search__Option_FullWidth">Make</option>
                                </select>
                            </div>
                            <div>
                                <select className="Search__Label_FullWidth">
                                    <option className="Search__Option_FullWidth">Model</option>
                                </select>
                            </div>
                        </div>

                        {/* Pickup Section */}
                        <p className="Search__Title">Pick Up</p>
                        <div className="Search__PickupGrid">
                            <div>
                                <input className="Search__PickupInput" placeholder="Lisbon" />
                            </div>
                            <div className="Search__PickupDateGrid">
                                <DatePicker
                                    className="Search__PickupDateItem"
                                    selected={startDate}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={this.handleChangeStart}
                                />
                                <DatePicker
                                    className="Search__PickupDateItem"
                                    selected={startDate}
                                    onChange={this.handleChangeStart}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat="h:mm aa"
                                    timeCaption="Time"
                                />
                            </div>
                        </div>


                        {/* Return Section */}
                        <p className="Search__Title">Return</p>
                        <div className="Search__PickupGrid">
                            <div>
                                <input className="Search__PickupInput" placeholder="Lisbon" />
                            </div>
                            <div className="Search__PickupDateGrid">
                                <DatePicker
                                    className="Search__PickupDateItem"
                                    selected={endDate}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={this.handleChangeEnd}
                                />

                                <DatePicker
                                    className="Search__PickupDateItem"
                                    selected={endDate}
                                    onChange={this.handleChangeEnd}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat="h:mm aa"
                                    timeCaption="Time"
                                />
                            </div>

                        </div>

                        {/* Input Extras Section */}
                        <p className="Search__Title">Extras</p>
                        <div>
                            <ul className="Search__ExtrasGrid">
                                {extraOptions}
                            </ul>
                        </div>

                        <input
                            type="submit"
                            className="Button Button__Publish"
                            value="REQUEST"
                        />
                        {/* <button type="button" className="
                    Button Button__Publish">REQUEST</button> */}
                    </form>
                    <div className="Search__BottomPadding" />
                </div>
            </div>
        );
    }
}

export default Request;
