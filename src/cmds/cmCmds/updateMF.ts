import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection, mintTokens, updateMintFee, updateWhitelist} from "../../candyMachine";
import {loadCreatorAccount, loadMinterAccount} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";

type Options = {
    collectionName:string
    fee:string
};

export const command: string = 'updateMF';
export const desc: string = 'update mint fee';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('collectionName', {
            alias: "collectionName",
            type: 'string',
            demandOption: true,
            describe: 'collectionName',
            default:"Daiwanwei"
        }).option('fee', {
            alias: "fee",
            type: 'string',
            demandOption: true,
            describe: 'mint fee',
            default:"0"
        })

export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        collectionName,fee
    }=argv

    const aptosClient=new AptosClient(NODE_URL)
    const minterAccount=loadCreatorAccount()
    const res=await updateMintFee(aptosClient,minterAccount,collectionName,BigInt(fee))
    const receipt = await aptosClient.waitForTransactionWithResult(res)
    //@ts-ignore
    const isSuccess=receipt.success
    if (isSuccess){
        console.log(`txn success,${res}`)
    }else {
        //@ts-ignore
        console.log(`txn fail,${receipt.vm_status}`)
    }
    process.exit(0);
};
