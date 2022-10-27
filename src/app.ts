import {config} from "dotenv";
config()
import {AptosAccount, AptosClient, HexString, TokenClient, TxnBuilderTypes} from "aptos";
import {
    compareFile,
    fundAccount,
    getUnUploadNFT,
    loadCreatorAccount,
    loadMinterAccount
} from "./helpers";
import {NODE_URL} from "./config";
import {
    createCandyMachine,
    createCollection,
    getCmConfig,
    getSupplyInWhitelist,
    mintTokens,
    uploadNFT
} from "./candyMachine";

async function main() {
    console.log(`hello`)
    // const account=loadCreatorAccount()
    const account=new AptosAccount()
    console.log(account.toPrivateKeyObject())
    await fundAccount(account.address().hex(),100_000_000)
}

main()
    .then(()=>console.log(`execute successfully`))
    .catch((err)=>{
        console.log(`execute fail,err:${err}`)
        process.exitCode=1
    })
