import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection, uploadNFT} from "../../candyMachine";
import {loadCreatorAccount, retryFn, shuffle, transformAttribute} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {logger} from "../../logger";
import {string} from "yargs";

type Options = {
    infoPath:string
    metadataDir:string
    royaltyInfo:string
    collectionName:string
};

export const command: string = 'setupCm';
export const desc: string = 'setup candy machine';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('infoPath', {
            alias: "ip",
            type: 'string',
            demandOption: true,
            describe: 'collection info file path',
            default:"/Users/daiwanwei/Projects/aptos_ex/aptos-nft-cm-example/collectionInfo-aaa.json"
        }).option('metadataDir', {
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
        })


interface CollectionInfo{
    collectionName:string
    description:string,
    uri:string,
    maxSupply:bigint,
    mintFee:bigint,
    maxSupplyPerUser:bigint,
    presaleMintTime:number,
    publicMintTime:number,
}

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
        infoPath,metadataDir,royaltyInfo
    }=argv
    logger.info(`metadata in (${metadataDir})`)
    logger.info(`collection info in (${infoPath})`)
    logger.info(`royalty info in (${royaltyInfo})`)
    const {
        creator,royaltyDenominator,royaltyNumerator
    }= JSON.parse(fs.readFileSync(royaltyInfo).toString()) as RoyaltyInfo
    const info= JSON.parse(fs.readFileSync(infoPath).toString()) as CollectionInfo
    const {
        collectionName, description, uri,maxSupplyPerUser,
        maxSupply, mintFee, presaleMintTime, publicMintTime
    }= info
    const account=loadCreatorAccount()
    const aptosClient=new AptosClient(NODE_URL)
    try {
        const req={
            name:collectionName,
            description:description,
            uri:uri,
            maxSupply:BigInt(maxSupply),
            mintFee: BigInt(mintFee),
            maxSupplyPerUser:BigInt(maxSupplyPerUser),
            presaleMintTime:presaleMintTime,
            publicMintTime:publicMintTime,
        }
        const res=await createCollection(aptosClient,account,req)
        const receipt = (await aptosClient.waitForTransactionWithResult(res))
        //@ts-ignore
        const isSuccess=receipt.success
        if (isSuccess){
            logger.info(`createCollection txn success,(${res})`)
            //@ts-ignore
            logger.info(`createCollection gas used, gas(${receipt.gas_used}),price(${receipt.gas_unit_price})`)
        }else {
            //@ts-ignore
            logger.error(`createCollection txn fail,(${receipt.vm_status})`)
            return
        }
    }catch (e){
        logger.error(`createCm txn fail,(${e})`)
        return
    }
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
            console.log(`upload nft:Step(${i}),Number(${j})`)
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
                const res=await uploadNFT(aptosClient,account,uploadNFTReq)
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
                const res=await uploadNFT(aptosClient,account,uploadNFTReq)
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
        await retryFn(5,fn)
    }
    process.exit(0);
};
