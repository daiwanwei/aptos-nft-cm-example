import type {Arguments, CommandBuilder} from 'yargs';
import {
    createCandyMachine,
    createCollection,
    mintTokens,
    updateMintFee,
    updateMintTime, updatePublic,
    updateWhitelist
} from "../../candyMachine";
import {loadCreatorAccount, loadMinterAccount} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {logger} from "../../logger";

type Options = {
    collectionName:string
    isPublic:boolean
};

export const command: string = 'updatePublic';
export const desc: string = 'update Public';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('collectionName', {
            alias: "collectionName",
            type: 'string',
            demandOption: true,
            describe: 'collectionName',
            default:"Daiwanwei"
        }).option('isPublic', {
            alias: "isPublic",
            type: 'boolean',
            demandOption: true,
            describe: 'isPublic',
            default: true
        })

export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        collectionName,isPublic
    }=argv
    try {
        const aptosClient=new AptosClient(NODE_URL)
        const minterAccount=loadCreatorAccount()
        const res=await updatePublic(aptosClient,minterAccount,collectionName,false)
        const receipt = await aptosClient.waitForTransactionWithResult(res)
        //@ts-ignore
        const isSuccess=receipt.success
        if (isSuccess){
            console.log(`updatePublic txn success,${res}`)
            //@ts-ignore
            logger.info(`updatePublic gas used, gas(${receipt.gas_used}),price(${receipt.gas_unit_price})`)
        }else {
            //@ts-ignore
            console.log(`updatePublic txn fail,${receipt.vm_status}`)
        }
    }catch (e){
        logger.error(`updatePublic txn fail,(${e})`)
    }
    process.exit(0);
};
