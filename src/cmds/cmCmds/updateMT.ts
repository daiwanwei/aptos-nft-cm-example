import type {Arguments, CommandBuilder} from 'yargs';
import {
    createCandyMachine,
    createCollection,
    mintTokens,
    updateMintFee,
    updateMintTime,
    updateWhitelist
} from "../../candyMachine";
import {loadCreatorAccount, loadMinterAccount} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {logger} from "../../logger";

type Options = {
    collectionName:string
    time:number
};

export const command: string = 'updateMT';
export const desc: string = 'update mint time';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('collectionName', {
            alias: "collectionName",
            type: 'string',
            demandOption: true,
            describe: 'collectionName',
            default:"Daiwanwei"
        }).option('time', {
            alias: "time",
            type: 'number',
            demandOption: true,
            describe: 'mint time',
            default: 0
        })

export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        collectionName,time
    }=argv
    try {
        const aptosClient=new AptosClient(NODE_URL)
        const minterAccount=loadCreatorAccount()
        const res=await updateMintTime(aptosClient,minterAccount,collectionName,time)
        const receipt = await aptosClient.waitForTransactionWithResult(res)
        //@ts-ignore
        const isSuccess=receipt.success
        if (isSuccess){
            console.log(`updateMintTime txn success,${res}`)
            //@ts-ignore
            logger.info(`updateMintTime gas used, gas(${receipt.gas_used}),price(${receipt.gas_unit_price})`)
        }else {
            //@ts-ignore
            console.log(`updateMintTime txn fail,${receipt.vm_status}`)
        }
    }catch (e){
        logger.error(`updateMintTime txn fail,(${e})`)
    }
    process.exit(0);
};
