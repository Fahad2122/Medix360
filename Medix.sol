// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Medix {
    struct Medicine {
        string name;
        string[] location;
        string[] date;
    }

    Medicine public medicine;

    mapping(string => address) public hashToMedicineName;

    address public owner;

    constructor(){
        owner = msg.sender;
        medicine.name = "Panadole";
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not valid hash");
        _;
    }

    function store(string memory _location, string memory _date) public onlyOwner{
        medicine.location.push(_location);
        medicine.date.push(_date);
    }

    function check() public view returns (string memory, string[] memory, string[] memory){
        return (medicine.name, medicine.location, medicine.date);
    }
}