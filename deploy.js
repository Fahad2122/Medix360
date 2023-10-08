const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main(){
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const bin = fs.readFileSync("Medix360_sol_Medix360.bin", "utf-8");
    const abi = fs.readFileSync("Medix360_sol_Medix360.abi", "utf-8");

    const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
    
    console.log("Deploying, Please wait...");
    const contract = await contractFactory.deploy();
    await contract.deploymentTransaction().wait(1);
    console.log(`contract deployed at: ${(await contract.getAddress()).toString()}`)

    let transcationResponse = await contract.setManufacturerName("Abbot Karachi");
    await transcationResponse.wait(1);
    const manufacturer = await contract.getManufacturer();
    console.log("Manufacturer:")
    console.log(` Id ${manufacturer.toString()}`);
    let vendor = await contract.checkVendor(manufacturer.toString());
    console.log(` name ${vendor.toString()}`);
    console.log();

    //registaring vendors
    //adding first vendor
    transcationResponse = await contract.registorVendor(process.env.VENDOR1_ID, process.env.VENDOR1_NAME);
    await transcationResponse.wait(1);
    //checking first added vendor
    vendor = await contract.checkVendor(process.env.VENDOR1_ID);
    console.log("Vendor:");
    console.log(` Id ${process.env.VENDOR1_ID}`);
    console.log(` name ${vendor.toString()}`);
    console.log();

    //adding second vendor
    transcationResponse = await contract.registorVendor(process.env.VENDOR2_ID, process.env.VENDOR2_NAME);
    await transcationResponse.wait(1);
    //checking second added vendor
    vendor = await contract.checkVendor(process.env.VENDOR2_ID);
    console.log(` Id ${process.env.VENDOR2_ID}`);
    console.log(` name ${vendor.toString()}`);
    console.log();

    //adding Medicine
    //adding first medicine
    transcationResponse = await contract.addMedicine(
        process.env.MED1_ID,
        process.env.MED1_NAME,
        process.env.MED1_MANUFACTURE_DATE,
        process.env.MED1_EXPIRY_DATE
    )
    await transcationResponse.wait(1);

    //tracking first medicine
    let medicine = await contract.trackMedicine(process.env.MED1_ID);
    console.log("Medicine:");
    console.log(` name ${medicine[0].toString()}`)
    console.log(` manufacturing date ${medicine[1].toString()}`);
    console.log(` expiry date ${medicine[2].toString()}`);
    vendor = await contract.checkVendor(medicine[3].toString());
    console.log(` supplyChain ${vendor}`);
    console.log();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })