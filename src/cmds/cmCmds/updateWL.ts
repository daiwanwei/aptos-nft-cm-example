import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection, mintTokens, updateWhitelist} from "../../candyMachine";
import {loadCreatorAccount, loadMinterAccount, readWhitelist, retryFn} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {logger} from "../../logger";
import * as csv from "fast-csv"
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
            default:"/Users/daiwanwei/Projects/aptos_ex/aptos-nft-cm-example/whitelist.csv"
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
    const wl=await readWhitelist(whitelist)
    const aptosClient=new AptosClient(NODE_URL)
    const minterAccount=loadCreatorAccount()
    const total=wl.length
    const batch=15
    const step=Math.floor(total/batch)
    for(let i=0;i<step;i++){
        logger.info(`updateWL step(${i},${step})`)
        const fn=async ()=>{
            const tmp=wl.slice(i*batch,(i+1)*batch)
            try {
                let addresses:TxnBuilderTypes.AccountAddress[]=[]
                let amounts:bigint[]=[]
                tmp.forEach(({address,mintAmount})=>{
                    addresses.push(TxnBuilderTypes.AccountAddress.fromHex(address))
                    amounts.push(BigInt(mintAmount))
                })
                const res=await updateWhitelist(aptosClient,minterAccount,collectionName,addresses,amounts)
                const receipt = await aptosClient.waitForTransactionWithResult(res)
                //@ts-ignore
                const isSuccess=receipt.success
                if (isSuccess){
                    logger.info(`updateWhitelist txn success,(${res})`)
                    //@ts-ignore
                    logger.info(`updateWhitelist gas used, gas(${receipt.gas_used}),price(${receipt.gas_unit_price})`)
                    return true
                }else {
                    logger.error(`updateWhitelist txn fail,filenames (${JSON.stringify(tmp)})`)
                    //@ts-ignore
                    logger.error(`updateWhitelist txn fail,(${receipt.vm_status})`)
                    return false
                }
            }catch (e){
                logger.error(`updateWhitelist txn fail,filenames (${JSON.stringify(tmp)})`)
                logger.error(`updateWhitelist NFT fail: err(${e})`)
                return false
            }
        }
        await retryFn(5,fn)
    }
    logger.info(`updateWL reminder(`)
    const fn=async ()=>{
        const tmp=wl.slice(step*batch,total)
        try {
            let addresses:TxnBuilderTypes.AccountAddress[]=[]
            let amounts:bigint[]=[]
            tmp.forEach(({address,mintAmount})=>{
                addresses.push(TxnBuilderTypes.AccountAddress.fromHex(address))
                amounts.push(BigInt(mintAmount))
            })
            const res=await updateWhitelist(aptosClient,minterAccount,collectionName,addresses,amounts)
            const receipt = await aptosClient.waitForTransactionWithResult(res)
            //@ts-ignore
            const isSuccess=receipt.success
            if (isSuccess){
                logger.info(`updateWhitelist txn success,(${res})`)
                //@ts-ignore
                logger.info(`updateWhitelist gas used, gas(${receipt.gas_used}),price(${receipt.gas_unit_price})`)
                return true
            }else {
                logger.error(`updateWhitelist txn fail,filenames (${JSON.stringify(tmp)})`)
                //@ts-ignore
                logger.error(`updateWhitelist txn fail,(${receipt.vm_status})`)
                return false
            }
        }catch (e){
            logger.error(`updateWhitelist txn fail,filenames (${JSON.stringify(tmp)})`)
            logger.error(`updateWhitelist NFT fail: err(${e})`)
            return false
        }
    }
    await retryFn(5,fn)

};
