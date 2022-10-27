import type {Arguments, CommandBuilder} from 'yargs';
import {
    createCandyMachine,
    createCollection, getCmConfig, getSupplyInWhitelist,
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
    handle:string
    account:string
};

export const command: string = 'getSupplyInWL';
export const desc: string = 'get supply in whitelist';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('handle', {
            alias: "h",
            type: 'string',
            demandOption: true,
            describe: 'handle',
            default:"Daiwanwei"
        }).option('account', {
            alias: "a",
            type: 'string',
            demandOption: true,
            describe: 'account',
            default: "0x499f47219e3891bd2716a728e7a8c71b19991d41fd70883549cf5f91bc34e11f"
        })

export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        handle,account
    }=argv
    try {
        const aptosClient=new AptosClient(NODE_URL)
        const res=await getSupplyInWhitelist(aptosClient,handle,account)
        logger.info(`user(${account}) supply ${res} in whitelist`)
    }catch (e){
        logger.error(`getSupplyInWhitelist fail,(${e})`)
    }
    process.exit(0);
};
