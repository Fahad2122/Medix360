require("dotenv").config()
const ethers = require("ethers")
const fs = require("fs-extra")

async function main() {
    let chain = new ethers.JsonRpcProvider(process.env.RPC_URL)
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, chain)

    const abi = fs.readFileSync("./Medix_sol_Medix.abi", "utf-8")
    const bin = fs.readFileSync("./Medix_sol_Medix.bin", "utf-8")

    const contractFactory = new ethers.ContractFactory(abi, bin, wallet)
    console.log("Deploying, Please wait")

    const contract = await contractFactory.deploy()
    await contract.deploymentTransaction().wait(1)
    console.log(`contract Deployed at ${(await contract.getAddress()).toString()}`)

    let transactionResponse = await contract.store("karachi", "24/Aug/2023")
    await transactionResponse.wait()
    transactionResponse = await contract.store("Lahore", "27/Aug/2023")
    await transactionResponse.wait(1)
    transactionResponse = await contract.store("Gujranwala", "28/Aug/2023")
    await transactionResponse.wait(1)

    const currentState = await contract.check()
    console.log(`Name: ${currentState[0]}`)
    console.log(`Locations: ${currentState[1]}`)
    console.log(`Dates: ${currentState[2]}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })