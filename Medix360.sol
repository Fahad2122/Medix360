// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Medix360 {
    //medicine structure
    struct Medicine{
        address id;
        string name;
        string m_date;
        string e_date;
        address[] supplyChain;
    }

    //variables
    Medicine[] medicine;
    address manufacturer;
    address[] vendors;

    mapping (address => Medicine) medicines;
    mapping (address => string) vendorNames;
    mapping (address => bool) vendorAvailbity;

    //constructor
    constructor(){
        manufacturer = msg.sender;
        vendors.push(manufacturer);
        vendorAvailbity[manufacturer] = true;
    }

    //events
    event MedicineAdded(address indexed id, string name, string m_date, string e_date, address[] supplyChain);

    //modifiers
    modifier onlyManufacturer {
        require(msg.sender == manufacturer, "Only manufacturer can have this permission");
        _;
    }
    modifier onlyVendors {
        require(vendorAvailbity[msg.sender], "Only register vendors can have this permission");
        _;
    }

    //functions
    function setManufacturerName(string memory _name) public onlyManufacturer{
        vendorNames[manufacturer] = _name;
    }
    function addMedicine(address _id, string memory _name, string memory _m_date, string memory _e_date) public onlyManufacturer{
        Medicine storage newMedicine = medicines[_id];
        newMedicine.id = _id;
        newMedicine.name = _name;
        newMedicine.m_date = _m_date;
        newMedicine.e_date = _e_date;

        newMedicine.supplyChain.push(manufacturer);
        
        emit MedicineAdded(_id, _name, _m_date, _e_date, newMedicine.supplyChain);
    }
    function registorVendor(address _vendor, string memory _name) public onlyManufacturer{
        vendors.push(_vendor);
        vendorNames[_vendor] = _name;
        vendorAvailbity[_vendor] = true;
    }
    function addToSupplyChain(address _id) public onlyVendors{
        Medicine storage med = medicines[_id];
        med.supplyChain.push(msg.sender);
    }

    //getter functions
    function getManufacturer() public view returns(address){
        return manufacturer;
    }
    function checkVendor(address _vendor) public view returns(string memory) {
        return vendorNames[_vendor];
    }
    function trackMedicine(address _id) public view returns(string memory, string memory, string memory, address[] memory) {
        Medicine memory med = medicines[_id];
        return(med.name, med.m_date, med.e_date, med.supplyChain);
    }

}