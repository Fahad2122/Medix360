const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main(){
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contractAddress = process.env.CONTRACT_ADDRESS;

    const abi = fs.readFileSync("Medix360_sol_Medix360.abi", "utf-8");

    const contract = new ethers.Contract(contractAddress, abi, provider);

    let medicine = await contract.trackMedicine(process.env.MED1_ID);
    
    console.log('Medicine SupplyChain');
    console.log(` Name: ${medicine[0]}`);
    console.log(` Manufacture Date: ${medicine[1]}`);
    console.log(` Expiry Date; ${medicine[2]}`);
    
    console.log(' SupplyChain:')
    for(let i=0; i<medicine[3].length; i++){
        let vendorName = await contract.checkVendor(medicine[3][i].toString());
        console.log(`  ${i+1} ${vendorName}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.log(error)
    process.exit(1)
})