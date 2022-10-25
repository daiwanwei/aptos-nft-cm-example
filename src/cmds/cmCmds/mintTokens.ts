import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection, mintTokens} from "../../candyMachine";
import {loadCreatorAccount, loadMinterAccount} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {logger} from "../../logger";

type Options = {
    creator:string
    collectionName:string
    amount:string
};

export const command: string = 'mintTokens';
export const desc: string = 'mint tokens';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('amount', {
            alias: "amount",
            type: 'string',
            demandOption: true,
            describe: 'amount',
            default:"5"
        }).option('collectionName', {
            alias: "collectionName",
            type: 'string',
            demandOption: true,
            describe: 'collection name',
            default:"Daiwanwei-3"
        })


export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        amount,collectionName
    }=argv
    const aptosClient=new AptosClient(NODE_URL)
    const minterAccount=loadMinterAccount()
    const creatorAccount=loadCreatorAccount()
    try {
        const mintTokensReq={
            creator: TxnBuilderTypes.AccountAddress.fromHex(creatorAccount.address().hex()),
            collectionName,
            amount:BigInt(amount),
        }
        const res=await mintTokens(aptosClient,minterAccount,mintTokensReq)
        const receipt = (await aptosClient.waitForTransactionWithResult(res))
        //@ts-ignore
        const isSuccess=receipt.success
        if (isSuccess){
            logger.info(`createCm txn success,(${res})`)
        }else {
            //@ts-ignore
            logger.error(`createCm txn fail,(${receipt.vm_status})`)
        }
    }catch (e){
        logger.error(`createCm txn fail,(${e})`)
    }
    process.exit(0);
};
