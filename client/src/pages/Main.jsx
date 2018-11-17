import React, { Component } from 'react';
import truffleContract from 'truffle-contract';
import ServiceStorageContract from '../contracts/ServiceStorage.json';
import EuroCoinContract from '../contracts/EuroCoin.json';
import EscrowContract from '../contracts/Escrow.json';
import getWeb3 from '../utils/getWeb3';

import './Main.module.css';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            web3: null,
            accounts: null,
            contractService: null,
            euroCoin: null,
            escrowContract: null
        };
    }

    async componentDidMount() {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const Contract = truffleContract(ServiceStorageContract);
            Contract.setProvider(web3.currentProvider);
            const instance = await Contract.deployed();

            // Get the contract instance.
            const ContractCoin = truffleContract(EuroCoinContract);
            ContractCoin.setProvider(web3.currentProvider);
            const instanceCoin = await ContractCoin.deployed();

            // Get the contract instance.
            const ContractEscrow = truffleContract(EscrowContract);
            ContractEscrow.setProvider(web3.currentProvider);
            const instanceEscrow = await ContractEscrow.deployed();

            this.setState({
                web3,
                accounts,
                contractService: instance,
                euroCoin: instanceCoin,
                escrowContract: instanceEscrow,
            });
        } catch (error) {
            console.log('Failed to load web3, accounts, or contract. Check console for details.');
            console.log(error);
        }
    }

    async deepSearch(serviceType, city, street) {
        const { contractService } = this.state;
        const results = [];
        try {
            let lastResult;
            lastResult = await contractService.findService(serviceType, city, street, 0);
            while (lastResult[0] !== 0x0) {
                results.push(lastResult);
                // eslint-disable-next-line no-await-in-loop
                lastResult = await contractService
                    .findService(serviceType, city, street, lastResult[2]);
            }
        } catch (error) {
            //
        }
        return results;
    }

    /**
     * this is where the magic happens!
     * @param {array} results all the results from search
     */
    // eslint-disable-next-line class-methods-use-this
    async crossSearch(results) {
        const rental = results[0];
        const delivery = results[1];
        const extras = results[2];

        // do somthing ... pff

        const biggerSize = Math.max(rental.length, delivery.length, extras.length);
        //
        for (let bs = 0; bs < biggerSize; bs += 1) {
            //
        }
    }

    /**
     * action after click on "search button on frontend"
     * @param {json} jsonRequest a json object containing all the information from frontend
     */
    // eslint-disable-next-line class-methods-use-this
    async search(jsonRequest) {
        const totalServiceTypes = 3;
        const allResults = [];
        for (let s = 0; s < totalServiceTypes; s += 1) {
            allResults.push(this.deepSearch(s, jsonRequest.city, jsonRequest.street));
        }
        this.crossSearch(allResults);
        return allResults;
    }

    /**
     * transfer from user to escrow
     * @param {string} toAccount the account address
     * @param {integer} amount amount of coins to transfer
     */
    async proceedEscrow(toAccount, amount) {
        const { web3, accounts, escrowContract } = this.state;
        try {
            await escrowContract.escrow(toAccount, amount, { from: accounts[0] });
            const paymentFilter = web3.eth.filter('latest');
            paymentFilter.watch((error, log) => {
                if (error) {
                    console.log('An error ocurred!');
                } else {
                    console.log('In Escrow!');
                }
                console.log(log);
                paymentFilter.stopWatching();
            });
        } catch (error) {
            //
        }
    }

    /**
     * transfer from escrow to final user
     * @param {string} toAccount the account address
     * @param {integer} amount amount of coins to transfer
     */
    async finishEscrow(toAccount, amount) {
        const { web3, accounts, escrowContract } = this.state;
        try {
            await escrowContract.finish(toAccount, amount, { from: accounts[0] });
            const paymentFilter = web3.eth.filter('latest');
            paymentFilter.watch((error, log) => {
                if (error) {
                    console.log('An error ocurred!');
                } else {
                    console.log('In Escrow!');
                }
                console.log(log);
                paymentFilter.stopWatching();
            });
        } catch (error) {
            //
        }
    }

    render() {
        const { web3 } = this.state;
        if (!web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                <div className="Search__Container">
                    <form className="Search__Form">

                        {/* Option Service Section */}
                        <p className="Search__Title">Service</p>
                        <select className="Search__Label_FullWidth">
                            <option className="Search__Option_FullWidth">Rental / Delivery / Service</option>
                        </select>

                        {/* Option Vehicle Section */}
                        <p className="Search__Title">Vehicle</p>
                        <div className="Search__LabelGrid">
                            <div>
                                <select className="Search__Label_FullWidth">
                                    <option className="Search__Option_FullWidth">Body Type</option>
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

                        {/* Input Search Section */}
                        <p className="Search__Title">Area</p>
                        <div>
                            <input className="Search__Input_FullWidth" placeholder="Address, City" />
                        </div>


                        {/* Input Extras Section */}
                        <p className="Search__Title">Extras</p>
                        <div>
                            <ul className="Search__ExtrasGrid">
                                <li className="Extras__Item">
                                    <input className="Extras__Checkbox" type="checkbox" />
                                    <div className="Extras__Text">Child Seat</div>
                                </li>
                                <li className="Extras__Item">
                                    <input className="Extras__Checkbox" type="checkbox" />
                                    <div className="Extras__Text">Baby Stroller</div>
                                </li>
                                <li className="Extras__Item">
                                    <input className="Extras__Checkbox" type="checkbox" />
                                    <div className="Extras__Text">Toddler Seat</div>
                                </li>
                                <li className="Extras__Item">
                                    <input className="Extras__Checkbox" type="checkbox" />
                                    <div className="Extras__Text">Camping Table and Chairs</div>
                                </li>
                                <li className="Extras__Item">
                                    <input className="Extras__Checkbox" type="checkbox" />
                                    <div className="Extras__Text">Infant Seat</div>
                                </li>
                                <li className="Extras__Item">
                                    <input className="Extras__Checkbox" type="checkbox" />
                                    <div className="Extras__Text">Wifi Hotspot</div>
                                </li>
                                <li className="Extras__Item">
                                    <input className="Extras__Checkbox" type="checkbox" />
                                    <div className="Extras__Text">Chaffeur</div>
                                </li>
                                <li className="Extras__Item">
                                    <input className="Extras__Checkbox" type="checkbox" />
                                    <div className="Extras__Text">GPS</div>
                                </li>
                            </ul>
                        </div>

                        <button type="button" className="Button Button__Publish">PUBLISH</button>
                    </form>
                    <div className="Search__BottomPadding" />
                </div>
            </div>
        );
    }
}

export default Main;
