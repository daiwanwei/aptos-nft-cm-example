import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection, mintTokens, uploadNFT} from "../../candyMachine";
import {loadCreatorAccount, loadMinterAccount, retryFn, transformAttribute} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {string} from "yargs";
import {logger} from "../../logger";

type Options = {
    metadataDir:string
    collectionName:string
    creator:string
};

export const command: string = 'uploadNFT';
export const desc: string = 'upload NFT';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('metadataDir', {
            alias: "md",
            type: 'string',
            demandOption: true,
            describe: 'metadataDir',
            default:"/Users/daiwanwei/Projects/BAAC/BAAC_metadata/meta_test"
        }).option('collectionName', {
            alias: "collectionName",
            type: 'string',
            demandOption: true,
            describe: 'collection name',
            default:"Daiwanwei-3"
        }).option('creator', {
            alias: "creator",
            type: 'string',
            demandOption: true,
            describe: 'creator',
            default:"0xc931187f52e9aac219517880805f64eb4243dbe291fc150a9af5548714fbf202"
        })


interface Info{
    name:string
    description:string,
    uri:string,
    attributes:Attribute[],
}

interface Attribute{
    trait_type:string
    value:string
}

export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        metadataDir,collectionName,creator
    }=argv
    const aptosClient=new AptosClient(NODE_URL)
    const creatorAccount=loadCreatorAccount()
    const filenameList= fs.readdirSync(metadataDir)
    console.log(filenameList)
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
            console.log(`upload nft:Step(${i}),Number(${j})`)
            const filepath=`${metadataDir}/${filenameList[j]}`
            const info= JSON.parse(fs.readFileSync(filepath).toString()) as Info
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
            propertyTypes
        }
        const fn=async ()=>{
            try {
                const res=await uploadNFT(aptosClient,creatorAccount,uploadNFTReq)
                const receipt = (await aptosClient.waitForTransactionWithResult(res))
                //@ts-ignore
                const isSuccess=receipt.success
                if (isSuccess){
                    logger.info(`uploadNFT txn success,(${res})`)
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
        await retryFn(5,fn)

    }
    let tokenNames:string[]=[]
    let descriptions:string[]=[]
    let uris:string[]=[]
    let propertyKeys:string[][]=[]
    let propertyValues:number[][][]=[]
    let propertyTypes:string[][]=[]
    for (let k=(step*batch);k<amount;k++){
        console.log(`upload nft:Reminder,Number(${k})`)
        const filepath=`${metadataDir}/${filenameList[k]}`
        const info= JSON.parse(fs.readFileSync(filepath).toString()) as Info
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
        propertyTypes
    }

    const fn=async ()=>{
        try {
            const res=await uploadNFT(aptosClient,creatorAccount,uploadNFTReq)
            const receipt = (await aptosClient.waitForTransactionWithResult(res))
            //@ts-ignore
            const isSuccess=receipt.success
            if (isSuccess){
                logger.info(`uploadNFT txn success,(${res})`)
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
    await retryFn(5,fn)
    process.exit(0);
};
