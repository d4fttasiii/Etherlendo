pragma solidity ^0.4.24;


contract ProjectContract {


  address public funding = this;  
  address constant public receiver = 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef;
  uint constant public total = 50;
  uint public fundedAmount;
  uint constant public interest = 5;
  uint public projectEnd;
  enum State { Init, Running, Funded, Failed, Redemption, Closed }
  State public state = State.Init;
  mapping(address => uint) public investments;
  mapping(address => uint) public interests;
  address[] public investors;

  event InvestedAmountIncreased(uint amount);
  event FundingSuccessful();
  event FundingFailed();
  event FundingClosed();
  event InvestmentWithInterestClaimed(address receiver, uint amount);
  event FundedAmountTransfered(address receiver, uint amount);

  modifier verifyAmount() {
    require(msg.value + funding.balance <= total);
    _;
  }

  modifier InitPhase() {
    require(state == State.Init);
    _;
  }

  modifier fundingPhase() {
    require(state == State.Running && now < projectEnd);
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

  function startProject() public InitPhase {
    state = State.Running;
    projectEnd = now + 5 minutes;
  }
  
  function getCurrentFundingBalance() view public returns(uint){
    return funding.balance;
  }

  function invest() public payable verifyAmount fundingPhase {
    emit InvestedAmountIncreased(funding.balance);

    investments[msg.sender] += msg.value;
    interests[msg.sender] += (msg.value / 100 * interest);
    fundedAmount = funding.balance;

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

    if (funding.balance == total) {
      endFunding();
    }
  }

  function endFunding() public {
    require(state == State.Running);
    require(projectEnd < now || funding.balance == total);

    if (funding.balance == total) {
      state = State.Funded;
      emit FundingSuccessful();
    } else {
      state = State.Failed;
      emit FundingFailed();
    }
  }

  function transferFunds() public {       
    require(now >= projectEnd);
    require(state == State.Funded);
    require(total == funding.balance);

    emit FundedAmountTransfered(receiver, funding.balance);
    
    receiver.transfer(funding.balance);
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

    require(funding.balance == total + (total / 100 * interest));

    for (uint i = 0; i < investors.length; i++) {
      if (investors[i] == msg.sender) {        
        uint amount = interests[investors[i]];
        interests[investors[i]] = 0;

        if (!msg.sender.send(amount)) {
          interests[investors[i]] = amount;
        } else {
          emit InvestmentWithInterestClaimed(msg.sender, amount);
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
      emit FundingClosed();
      state = State.Closed;
    }
  }

}
