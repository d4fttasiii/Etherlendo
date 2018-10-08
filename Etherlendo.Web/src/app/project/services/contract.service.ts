import { Injectable } from '@angular/core';
import * as Web3 from '../../../assets/Web3';
import { Project } from '../models/project';

declare let require: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private _web3: any;
  private _account: string = null;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this._web3 = new Web3(window.web3.currentProvider);
    } else {
      this._web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
    }
  }

  public getProjectDetails(project: Project) {

    let tokenContract = new this._web3.eth.Contract(tokenAbi, project.contractAddress);
    console.log(tokenContract);

    tokenContract.methods.total.call().then(total => {
      project.total = parseInt(total);
    });

    tokenContract.methods.interest().call().then(interest => {
      project.interest = parseInt(interest);
    });

    tokenContract.methods.projectEnd().call().then(projectEnd => {
      project.fundingEndsAt = new Date(parseInt(projectEnd));
    });

    tokenContract.methods.fundedAmount().call().then(fundedAmount => {
      project.investedAmount = parseInt(fundedAmount);
    });

    tokenContract.methods.state().call().then(state => {
      project.started = state === 1;
    });
  }

  public getInvestments(project: Project): Promise<any[]> {
    let tokenContract = new this._web3.eth.Contract(tokenAbi, project.contractAddress);

    return tokenContract.methods.investors().call();
  }

  public startFunding(project: Project) {
    let tokenContract = new this._web3.eth.Contract(tokenAbi, project.contractAddress);

    tokenContract.methods.startProject().call().then(response => console.log(response));
  }

  public isAddress(eth: string): boolean {
    return this._web3.utils.isAddress(eth);
  }

  private async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
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

      this._web3.eth.defaultAccount = this._account;
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
    "inputs": [],
    "name": "projectEnd",
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
    "name": "fundedAmount",
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
    "name": "funding",
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "InvestedAmountIncreased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "FundingSuccessful",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "FundingFailed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "FundingClosed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "InvestmentWithInterestClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundedAmountTransfered",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "startProject",
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
    "name": "endFunding",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
    "name": "payback",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "claimInvestedAmountWithInterest",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];