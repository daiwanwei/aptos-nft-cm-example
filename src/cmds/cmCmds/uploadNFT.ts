import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection, mintTokens, uploadNFT} from "../../candyMachine";
import {loadCreatorAccount, loadMinterAccount, retryFn, shuffle, transformAttribute} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {string} from "yargs";
import {logger} from "../../logger";
import {subtle} from "crypto";

type Options = {
    metadataDir:string
    royaltyInfo:string
    collectionName:string
};

export const command: string = 'uploadNFT';
export const desc: string = 'upload NFT';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('metadataDir', {
            alias: "m",
            type: 'string',
            demandOption: true,
            describe: 'metadataDir',
            default:"/Users/daiwanwei/Projects/BAAC/BAAC_metadata/meta_test"
        }).option('royaltyInfo', {
            alias: "ri",
            type: 'string',
            demandOption: true,
            describe: 'royaltyInfo',
            default:"/Users/daiwanwei/Projects/aptos_ex/aptos-nft-cm-example/royaltyInfo.json"
        }).option('collectionName', {
            alias: "collectionName",
            type: 'string',
            demandOption: true,
            describe: 'collection name',
            default:"Daiwanwei-3"
        })


interface TokenInfo{
    name:string
    description:string,
    uri:string,
    attributes:Attribute[],
}

interface Attribute{
    trait_type:string
    value:string
}

interface RoyaltyInfo{
    creator:string
    royaltyNumerator:number,
    royaltyDenominator:number,
}

export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        metadataDir,collectionName,royaltyInfo
    }=argv
    logger.info(`metadata in (${metadataDir})`)
    logger.info(`collectionName info in (${collectionName})`)
    logger.info(`royalty info in (${royaltyInfo})`)
    const {
        creator,royaltyDenominator,royaltyNumerator
    }= JSON.parse(fs.readFileSync(royaltyInfo).toString()) as RoyaltyInfo

    const aptosClient=new AptosClient(NODE_URL)
    const creatorAccount=loadCreatorAccount()
    const filenameList= fs.readdirSync(metadataDir)
    shuffle(filenameList)
    const amount=filenameList.length
    const batch=15
    const step=Math.floor(amount/batch)
    // // const reminder=amount%batch
    for (let i=0;i<step;i++){
        console.log(`upload nft:Step(${i})`)
        let tokenNames:string[]=[]
        let descriptions:string[]=[]
        let uris:string[]=[]
        let propertyKeys:string[][]=[]
        let propertyValues:number[][][]=[]
        let propertyTypes:string[][]=[]
        for (let j=(i*batch);j<((i+1)*batch);j++){
            console.log(`upload nft:Step(${i}),Number(${j}),filename(${filenameList[j]})`)
            if (filenameList[j].split('.').pop()!=="json") continue;
            const filepath=`${metadataDir}/${filenameList[j]}`
            const info= JSON.parse(fs.readFileSync(filepath).toString()) as TokenInfo
            const {
                name, description, uri,attributes
            }= info
            tokenNames.push(name)
            descriptions.push(description)
            uris.push(uri)
            const {propertyKey,propertyType,propertyValue}=transformAttribute(attributes)
            propertyKeys.push(propertyKey)
            propertyTypes.push(propertyType)
            propertyValues.push(propertyValue)
        }
        const uploadNFTReq={
            creator:TxnBuilderTypes.AccountAddress.fromHex(creator),
            collectionName,
            tokenNames,
            descriptions,
            uris,
            propertyKeys,
            propertyValues,
            propertyTypes,
            royaltyDenominator,
            royaltyNumerator
        }
        const fn=async ()=>{
            try {
                const res=await uploadNFT(aptosClient,creatorAccount,uploadNFTReq)
                const receipt = (await aptosClient.waitForTransactionWithResult(res))
                //@ts-ignore
                const isSuccess=receipt.success
                if (isSuccess){
                    logger.info(`uploadNFT txn success,(${res})`)
                    //@ts-ignore
                    logger.info(`uploadNFT gas used, gas(${receipt.gas_used}),price(${receipt.gas_unit_price})`)
                    return true
                }else {
                    logger.error(`uploadNFT txn fail,filenames (${JSON.stringify(tokenNames)})`)
                    //@ts-ignore
                    logger.error(`uploadNFT txn fail,(${receipt.vm_status})`)
                    return false
                }
            }catch (e){
                logger.error(`uploadNFT txn fail,filenames (${JSON.stringify(tokenNames)})`)
                logger.error(`upload NFT fail: err(${e})`)
                return false
            }
        }
        await retryFn(1,fn)

    }
    let tokenNames:string[]=[]
    let descriptions:string[]=[]
    let uris:string[]=[]
    let propertyKeys:string[][]=[]
    let propertyValues:number[][][]=[]
    let propertyTypes:string[][]=[]
    for (let k=(step*batch);k<amount;k++){
        console.log(`upload nft:Reminder,Number(${k}),Filename(${filenameList[k]})`)
        if (filenameList[k].split('.').pop()!=="json") continue;
        const filepath=`${metadataDir}/${filenameList[k]}`
        const info= JSON.parse(fs.readFileSync(filepath).toString()) as TokenInfo
        const {
            name, description, uri,attributes
        }= info
        tokenNames.push(name)
        descriptions.push(description)
        uris.push(uri)
        const {propertyKey,propertyType,propertyValue}=transformAttribute(attributes)
        propertyKeys.push(propertyKey)
        propertyTypes.push(propertyType)
        propertyValues.push(propertyValue)
    }
    if (tokenNames.length>0){
        const uploadNFTReq={
            creator:TxnBuilderTypes.AccountAddress.fromHex(creator),
            collectionName,
            tokenNames,
            descriptions,
            uris,
            propertyKeys,
            propertyValues,
            propertyTypes,
            royaltyDenominator,
            royaltyNumerator
        }

        const fn=async ()=>{
            try {
                const res=await uploadNFT(aptosClient,creatorAccount,uploadNFTReq)
                const receipt = (await aptosClient.waitForTransactionWithResult(res))
                //@ts-ignore
                const isSuccess=receipt.success
                if (isSuccess){
                    logger.info(`uploadNFT txn success,(${res})`)
                    //@ts-ignore
                    logger.info(`uploadNFT gas used, gas(${receipt.gas_used}),price(${receipt.gas_unit_price})`)
                    return true
                }else {
                    logger.error(`uploadNFT txn fail,filenames (${JSON.stringify(tokenNames)})`)
                    //@ts-ignore
                    logger.error(`uploadNFT txn fail,(${receipt.vm_status})`)
                    return false
                }
            }catch (e){
                logger.error(`uploadNFT txn fail,filenames (${JSON.stringify(tokenNames)})`)
                logger.error(`upload NFT fail: err(${e})`)
                return false
            }
        }
        await retryFn(1,fn)
    }
    process.exit(0);
};
