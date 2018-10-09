pragma solidity ^0.4.24;


contract ProjectContract {


  address constant public receiver = 0x83c5BBea4831900563D77f7551E09DE553170658;
  uint constant public total = 50 ether;
  uint constant public interest = 5;
  uint public fundedAmount;
  uint public fundingEnd;
  enum State { Init, Running, Funded, Failed, Redemption, Closed }
  State public state = State.Init;
  mapping(address => uint) public investments;
  mapping(address => uint) public interests;
  address[] public investors;

  // event InvestedAmountIncreased(uint amount);
  // event FundingStarted();
  // event FundingSuccessful();
  // event FundingFailed();
  // event FundingClosed();
  // event InvestmentWithInterestClaimed(address receiver, uint amount);
  // event FundedAmountTransfered(address receiver, uint amount);

  modifier verifyAmount() {
    require(address(this).balance <= total);
    _;
  }

  modifier initPhase() {
    require(state == State.Init);
    _;
  }

  modifier fundingPhase() {
    require(state == State.Running && now < fundingEnd);
    _;
  }

  modifier redemptionPhase() {    
    require(state == State.Redemption);
    _;
  }

  modifier closedPhase() {    
    require(state == State.Closed);
    _;
  }

  function startFunding() public initPhase {
    state = State.Running;
    fundingEnd = now + 5 minutes;
    // emit FundingStarted();
  }
  
  function getCurrentFundingBalance() view public returns(uint) {
    return address(this).balance;
  }

  function invest() public payable verifyAmount fundingPhase {
    // emit InvestedAmountIncreased(address(this).balance);

    investments[msg.sender] += msg.value;
    interests[msg.sender] += (msg.value / 100 * interest);
    fundedAmount = address(this).balance;

    bool alreadyInvestor = false;
    for (uint i = 0; i < investors.length; i++) {
      if (investors[i] == msg.sender) {
        alreadyInvestor = true;
        break;
      }
    }
    if (!alreadyInvestor) {
      investors.push(msg.sender);
    }

    if (address(this).balance == total) {
        state = State.Funded;
        // emit FundingSuccessful();
    }    
  }

  function transferFunds() public {       
    require(now >= fundingEnd || state == State.Funded);
    require(total == address(this).balance);
    
    receiver.transfer(address(this).balance);
    // emit FundedAmountTransfered(receiver, address(this).balance);
    state = State.Redemption;
  }

  function payInterest() public payable {
    require(msg.sender == receiver);
    require(msg.value == (total / 100 * interest));
  }

  function payback() public payable {
    require(msg.sender == receiver);
    require(msg.value == total);
  }

  function claimInvestedAmountWithInterest() public redemptionPhase {

    require(address(this).balance == total + (total / 100 * interest));

    for (uint i = 0; i < investors.length; i++) {
      if (investors[i] == msg.sender) {        
        uint amount = interests[investors[i]];
        interests[investors[i]] = 0;

        if (!msg.sender.send(amount)) {
          interests[investors[i]] = amount;
        } else {
         // emit InvestmentWithInterestClaimed(msg.sender, amount);
        }
        break;
      }
    }

    bool interestPayedBack = true;
    for (uint j = 0; j < investors.length; j++) {
      if (interests[investors[i]] != 0) {
        interestPayedBack = false;
        break;
      }
    }

    if (interestPayedBack) {
      // emit FundingClosed();
      state = State.Closed;
    }
  }
}
