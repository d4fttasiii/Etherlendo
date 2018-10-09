const ProjectContract = artifacts.require('../../contracts/ProjectContract.sol');

contract('ProjectContract', function (accounts) {

  describe('positive scenario', function () {

    it('initiates contract and check contants and init values', async function () {
      // Arrange
      const contract = await ProjectContract.deployed();

      // Assert
      const receiver = await contract.receiver.call();
      assert.equal(receiver, 0x11717003821d4851325Fe1Df2bFee86839850E7B, `receiver don't match, found receiver is ${receiver}`);
      const total = await contract.total.call();
      assert.equal(total, 50e+18, `Funding total limit doesn't match, found value: ${total}`);
      const interest = await contract.interest.call();
      assert.equal(interest, 5, `Funding interest doesn't match, found value: ${interest}`);
      const state = await contract.state.call();
      assert.equal(state, 0, `Funding state should be Init`);
      const fundingEnd = await contract.fundingEnd.call();
      assert.equal(fundingEnd, 0, `Funding end data should not be set`);
    });

    it('starting the funding, changes the state and sets the end date', async function () {
      // Arrange
      const contract = await ProjectContract.deployed();

      // Act
      await contract.startFunding();

      // Assert
      const state = await contract.state.call();
      assert.equal(state, 1, `Funding state should be Running`);
      const fundingEnd = await contract.fundingEnd.call();
      assert.notEqual(fundingEnd, 0, `Funding end data should be set`);
    });

    it('multiple investments into the project', async function () {
      // Arrange
      const contract = await ProjectContract.deployed();

      // Act
      await contract.invest({ from: accounts[9], value: 10e+18 });
      await contract.invest({ from: accounts[8], value: 10e+18 });
      await contract.invest({ from: accounts[7], value: 10e+18 });
      await contract.invest({ from: accounts[6], value: 10e+18 });

      // Assert
      const fundingBalance = await contract.getCurrentFundingBalance();
      assert.equal(fundingBalance, 40e+18, `Funded amount doesn't match: ${fundingBalance}`);
      const investorsCount = await contract.getInvestorCount();
      assert.equal(investorsCount, 4, `Investor count doesn't match: ${investorsCount}`);
    });

    it('last investment, reaching the funding total limit', async function () {
      // Arrange
      const contract = await ProjectContract.deployed();

      // Act
      await contract.invest({ from: accounts[5], value: 10e+18 });

      // Assert
      const fundingBalance = await contract.getCurrentFundingBalance();
      assert.equal(fundingBalance, 50e+18, `Funded amount doesn't match: ${fundingBalance}`);
      const state = await contract.state.call();
      assert.equal(state, 2, `Funding state should be Funded`);
    });

    it('transfer funds to the receiver', async function () {
      // Arrange
      const contract = await ProjectContract.deployed();

      // Act
      await contract.transferFunds();

      // Assert  
      const fundingBalance = await contract.getCurrentFundingBalance();
      assert.equal(fundingBalance, 0, `Funded amount doesn't match: ${fundingBalance}`);      
      const state = await contract.state.call();
      assert.equal(state, 4, `Funding state should be Redemption: ${state}`);
    });

    it('paying back the interest', async function() {      
      // Arrange
      const contract = await ProjectContract.deployed();

      // Act
      const receiver = await contract.receiver.call();
      await contract.payInterest({ from: receiver, value: 25e+17});

      // Assert
      const fundingBalance = await contract.getCurrentFundingBalance();
      assert.equal(fundingBalance, 25e+17, `Contract balance doesn't match: ${fundingBalance}`);
    });

    it('paying back the loan', async function() {      
      // Arrange
      const contract = await ProjectContract.deployed();

      // Act
      const receiver = await contract.receiver.call();
      await contract.payLoan({ from: receiver, value: 50e+18});

      // Assert
      const fundingBalance = await contract.getCurrentFundingBalance();
      assert.equal(fundingBalance, 525e+17, `Contract balance doesn't match: ${fundingBalance}`);
    });

    it('transfering the loan back with interest', async function() { 
      // Arrange
      const contract = await ProjectContract.deployed();

      // Act
      await contract.transferInvestedAmountWithInterest(); 
      
      // Assert
      const fundingBalance = await contract.getCurrentFundingBalance();
      assert.equal(fundingBalance, 0, `Contract balance doesn't match: ${fundingBalance}`);           
      const state = await contract.state.call();
      assert.equal(state, 5, `Funding state should be Closed: ${state}`);
    });

  });
});
