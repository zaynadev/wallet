// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.0;

contract Wallet {
    address[] approvers;
    uint limit;
    struct Transfer{
        uint id;
        address payable to;
        uint amount;
        uint approvals;
        bool sent;
    }
    Transfer[] transfers;
    mapping(address => mapping(uint => bool)) approvals;

    constructor(address[] memory _approvers, uint _limit){
        approvers = _approvers;
        limit = _limit;
    }

    modifier onlyApprovers(){
        bool allowed = false;
        for(uint i = 0; i < approvers.length; i++){
            if(approvers[i] == msg.sender){
                allowed = true;
            }
        }
        require(allowed == true, "only for approvers!");
        _;
    }

    function createTransfer(address payable to) external payable onlyApprovers {
        require(msg.value > 0, "Must provide value");
        Transfer memory transfer = Transfer(
            transfers.length,
            to,
            msg.value,
            0,
            false
        );
        transfers.push(transfer);
    }

    function approveTransfer(uint id) external onlyApprovers {
        require(approvals[msg.sender][id] == false, "Cannot approve twice!!!");
        require(transfers[id].sent == false, "transfer already sent!!!");
        transfers[id].approvals++;
        approvals[msg.sender][id] == true;
    }

    function withdraw(uint id) external {
        require(transfers[id].approvals > limit, "require approvals!!!");
        require(transfers[id].sent == true, "already done!!!");
        transfers[id].sent = true;
        transfers[id].to.transfer(transfers[id].amount);
    }

}