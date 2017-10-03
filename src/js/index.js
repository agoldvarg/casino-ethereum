import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import'./../css/index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastWinningNumber: 0,
    }

    this.web3 = new Web3();

    window.addEventListener('load', () => {

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        this.web3.setProvider(web3.currentProvider);
        console.log('[WEB3 PROVIDER]: USING INJECTED INSTANCE');
      } else {
        this.web3.setProvider("http://localhost:8545");
        console.log('[WEB3 PROVIDER]: USING FALLBACK INSTANCE: localhost:8545');
      }

      const MyContract = this.web3.eth.contract([{ "constant": true, "inputs": [], "name": "numberOfBets", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "playerInfo", "outputs": [{ "name": "amountBet", "type": "uint256" }, { "name": "numberSelected", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_guess", "type": "uint256" }], "name": "bet", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "minimumBet", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maxAmountOfBets", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalBet", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_minimumBet", "type": "uint256" }, { "name": "_maxAmountOfBets", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }]);

      this.state.contractInstance = MyContract.at("0x7ff7663e1f2c8b5978dd375420b97793b59c21c9");
    });
  }

  betOn(number) {
    const { contractInstance } = this.state;

    this.web3.eth.getAccounts((error, accounts) => {
      contractInstance.bet(number, {
        gas: 300000,
        from: accounts[0],
        value: this.web3.toWei(1, 'ether'),
      }, (err, result) => console.log(result));
    });
  }

  render() {
    return (
      <div className="app">
        <div className="meta">
          <div className="attribute meta__attribute">
            <div className="attribute__label">Last Winning #</div>
            <div className="attribute__value">{this.state.lastWinningNumber}</div>
          </div>
        </div>
        <h2>Make a bet on the next number:</h2>
        <div className="bets">
          <div onClick={() => this.betOn(1)} className="option bets__option">1</div>
          <div onClick={() => this.betOn(2)} className="option bets__option">2</div>
          <div onClick={() => this.betOn(3)} className="option bets__option">3</div>
          <div onClick={() => this.betOn(4)} className="option bets__option">4</div>
          <div onClick={() => this.betOn(5)} className="option bets__option">5</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);
