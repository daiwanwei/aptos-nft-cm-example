import type {Arguments, CommandBuilder} from 'yargs';
import {
    createCandyMachine,
    createCollection, getCmConfig,
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
    resourceAccount:string
};

export const command: string = 'getCmConfig';
export const desc: string = 'get candy machine config';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('collectionName', {
            alias: "cn",
            type: 'string',
            demandOption: true,
            describe: 'collectionName',
            default:"Daiwanwei"
        }).option('resourceAccount', {
            alias: "ra",
            type: 'string',
            demandOption: true,
            describe: 'resourceAccount',
            default: "0x499f47219e3891bd2716a728e7a8c71b19991d41fd70883549cf5f91bc34e11f"
        })

export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        collectionName,resourceAccount
    }=argv
    try {
        const aptosClient=new AptosClient(NODE_URL)
        const res=await getCmConfig(aptosClient,resourceAccount,collectionName)
        logger.info(`candy machine config`)
        logger.info(`mint time: presale(${res.presaleMintTime}),public(${res.publicMintTime})`)
        logger.info(`supply per user: ${res.maxSupplyPerUser}`)
        logger.info(`mint fee: ${res.mintFee}`)
        logger.info(`minted handle: ${res.mintsPerUserHandle}`)
        logger.info(`supply handle: ${res.supplyPerWLHandle}`)
        logger.info(`is public?: ${res.isPublic}`)
        logger.info(`candy machine token amount:`)
    }catch (e){
        logger.error(`getCmConfig fail,(${e})`)
    }
    process.exit(0);
};
