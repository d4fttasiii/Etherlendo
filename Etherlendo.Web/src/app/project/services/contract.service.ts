import { Injectable } from '@angular/core';
import * as Web3 from '../../../assets/Web3';
import { Project } from '../models/project';

declare let require: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private web3: any;
  private _account: string = null;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }

    this.getAccount().then(fromAddress => this._account = fromAddress);
  }

  public getProjectDetails(project: Project) {

    let tokenContract = new this.web3.eth.Contract(tokenAbi, project.contractAddress);

    Promise.all([
      tokenContract.methods.total().call(),
      tokenContract.methods.interest().call(),
      tokenContract.methods.fundingEnd().call(),
      tokenContract.methods.getCurrentFundingBalance().call(),
      tokenContract.methods.state().call()
    ]).then(responses => {
      const [total, interest, projectEnd, fundedAmount, state] = responses;
      project.total = parseInt(total);
      project.interest = parseInt(interest);
      project.fundingEndsAt = new Date(parseInt(projectEnd) * 1000);
      project.investedAmount = parseInt(fundedAmount);
      project.started = state == 1;
      project.investedPercentage = (project.investedAmount / project.total) * 100;
    });
  }

  public getInvestedAmount(contractAddress: string): Promise<number> {
    let tokenContract = new this.web3.eth.Contract(tokenAbi, contractAddress);
    return tokenContract.methods.getCurrentFundingBalance().call();
  }

  public getInvestments(project: Project): Promise<any[]> {
    let tokenContract = new this.web3.eth.Contract(tokenAbi, project.contractAddress);

    return tokenContract.methods.investors(1).call();
  }

  public startFunding(contractAddress: string, callback: (error, result) => void) {
    let tokenContract = new this.web3.eth.Contract(tokenAbi, contractAddress);

    tokenContract.methods.startFunding().send({ from: this._account }, callback);
  }

  public isAddress(eth: string): boolean {
    return this.web3.utils.isAddress(eth);
  }

  public invest(contractAddress: string, amount: number, callback: (error, result) => void) {
    let tokenContract = new this.web3.eth.Contract(tokenAbi, contractAddress);
    tokenContract.methods.invest().send({ from: this._account, value: this.web3.utils.toWei(amount, 'ether') }, callback);
  }

  private async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this.web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            console.error('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            console.error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
            return;
          }
          resolve(accs[0]);
        })
      }) as string;

      this.web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }
}

const tokenAbi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "interests",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "fundingEnd",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "total",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "investors",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "investments",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "state",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "interest",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "receiver",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "startFunding",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCurrentFundingBalance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "invest",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "transferFunds",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "payInterest",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "payLoan",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "transferInvestedAmountWithInterest",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getInvestorCount",
    "outputs": [
      {
        "name": "count",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];