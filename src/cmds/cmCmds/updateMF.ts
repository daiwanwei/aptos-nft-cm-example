import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection, mintTokens, updateMintFee, updateWhitelist} from "../../candyMachine";
import {loadCreatorAccount, loadMinterAccount} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {logger} from "../../logger";

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
    try {
        const aptosClient=new AptosClient(NODE_URL)
        const minterAccount=loadCreatorAccount()
        const res=await updateMintFee(aptosClient,minterAccount,collectionName,BigInt(fee))
        const receipt = await aptosClient.waitForTransactionWithResult(res)
        //@ts-ignore
        const isSuccess=receipt.success
        if (isSuccess){
            console.log(`updateMintFee txn success,${res}`)
            //@ts-ignore
            logger.info(`updateMintFee gas used, gas(${receipt.gas_used}),price(${receipt.gas_unit_price})`)
        }else {
            //@ts-ignore
            console.log(`updateMintFee txn fail,${receipt.vm_status}`)
        }
    }catch (e){
        logger.error(`updateMintFee txn fail,(${e})`)
    }
    process.exit(0);
};
