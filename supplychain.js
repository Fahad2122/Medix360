const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main(){
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const contractAddress = process.env.CONTRACT_ADDRESS;

    const abi = fs.readFileSync("Medix360_sol_Medix360.abi", "utf-8");

    const contract = new ethers.Contract(contractAddress, abi, provider);

    const wallet = new ethers.Wallet(process.env.VENDOR2_PRIVATE_KEY, provider);
    const connectedContract = await contract.connect(wallet);

    let vendor = await connectedContract.addToSupplyChain(process.env.MED1_ID);
    await vendor.wait(1);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.log(error);
    process.exit(1);
})