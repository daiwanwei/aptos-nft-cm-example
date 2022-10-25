import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection, mintTokens, updateWhitelist} from "../../candyMachine";
import {loadCreatorAccount, loadMinterAccount} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {logger} from "../../logger";

type Options = {
    collectionName:string,
    whitelist:string
};

export const command: string = 'updateWL';
export const desc: string = 'update whitelist';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('cn', {
            alias: "collectionName",
            type: 'string',
            demandOption: true,
            describe: 'collectionName',
            default:"Daiwanwei-5"
        }).option('wl', {
            alias: "whitelist",
            type: 'string',
            demandOption: true,
            describe: 'whitelist path',
            default:"/Users/daiwanwei/Projects/aptos_ex/aptos-nft-cm-example/whitelist.json"
        })

interface Info{
    address:string
    mintAmount:string,
}

export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        whitelist,
        collectionName
    }=argv

    const info= JSON.parse(fs.readFileSync(whitelist).toString()) as Info[]
    let addresses:TxnBuilderTypes.AccountAddress[]=[]
    let amounts:bigint[]=[]
    info.forEach(({address,mintAmount})=>{
        addresses.push(TxnBuilderTypes.AccountAddress.fromHex(address))
        amounts.push(BigInt(mintAmount))
    })
    const aptosClient=new AptosClient(NODE_URL)
    const minterAccount=loadCreatorAccount()
    const res=await updateWhitelist(aptosClient,minterAccount,collectionName,addresses,amounts)
    const receipt = await aptosClient.waitForTransactionWithResult(res)
    //@ts-ignore
    const isSuccess=receipt.success
    if (isSuccess){
        logger.info(`updateWhitelist txn success,(${res})`)
    }else {
        //@ts-ignore
        logger.error(`updateWhitelist txn fail,(${receipt.vm_status})`)
    }
    process.exit(0);
};
