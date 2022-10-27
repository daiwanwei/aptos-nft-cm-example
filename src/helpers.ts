import {AptosAccount, AptosClient, FaucetClient, TokenClient} from "aptos";
import {
    CREATOR_ADDRESS,
    CREATOR_PRIVATE_KEY,
    CREATOR_PUBLIC_KEY,
    FAUCET_URL,
    MINTER_ADDRESS, MINTER_PRIVATE_KEY,
    MINTER_PUBLIC_KEY,
    NODE_URL
} from "./config";
import {logger} from "./logger";
import * as csv from "fast-csv"
import exp from "constants";
import fs from "fs";

export async function fundAccount(account:string,amount:number) {
    const faucetClient = new FaucetClient(NODE_URL,FAUCET_URL);
    await faucetClient.fundAccount(account,amount)
    console.log(`fund account successfully,address(${account}),amount(${account})`)
}

export function loadCreatorAccount():AptosAccount {
    const account=AptosAccount.fromAptosAccountObject({
        address: CREATOR_ADDRESS,
        publicKeyHex: CREATOR_PUBLIC_KEY,
        privateKeyHex: CREATOR_PRIVATE_KEY,
    })
    return account
}

export function loadMinterAccount():AptosAccount {
    const account=AptosAccount.fromAptosAccountObject({
        address: MINTER_ADDRESS,
        publicKeyHex: MINTER_PUBLIC_KEY,
        privateKeyHex: MINTER_PRIVATE_KEY,
    })
    return account
}

export interface Attribute{
    trait_type:string
    value:string
}

export interface AttributeMap{
    propertyKey:string[]
    propertyValue:number[][]
    propertyType:string[]
}

export function transformAttribute(attributes:Attribute[]):AttributeMap{
    let propertyKey:string[]=[]
    let propertyValue:number[][]=[]
    let propertyType:string[]=[]
    for (const attr of attributes){
        const {trait_type,value}=attr
        propertyKey.push(trait_type)
        const encoded=[]
        for(let i=0; i<value.length; i++) {
            encoded.push(value.charCodeAt(i))
        }
        propertyValue.push(encoded)
        propertyType.push("String")
    }
    return {
        propertyKey,propertyValue,propertyType
    }
}

export function shuffle(array:any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


export async function retryFn(retry:number,fn: (()=>Promise<boolean>)){
    for (let r=retry;r>0;r--){
        logger.info(`retry function : time(${5-r}.${retry})`)
        const isOk=await fn()
        if (isOk){
            logger.info(`retry successfully : time(${5-r}.${retry})`)
            break
        }
    }
}

export interface WhitelistInfo{
    address:string
    mintAmount:string
}

export function readWhitelist(path:string):Promise<WhitelistInfo[]> {
    return new Promise((resolve, reject) => {
        const data:WhitelistInfo[] = [];

        csv
            .parseFile(path, {headers:true})
            .on("error", reject)
            .on("data", (row) => {
                data.push({
                    address:row.address,
                    mintAmount:row.amount
                });
            })
            .on("end", () => {
                resolve(data);
            });
    });
}

export async function getUnUploadNFT(
    client:TokenClient, collectionName:string,creator:string
    ){
    for (let i=663;i<=1000;i++){
        const tokenName=`Aptos Polar Bears #${i}`
        // const tokenName="Aptos Polar Bears #187"
        const oldFile=`/Users/daiwanwei/Projects/BAAC/APB_metadata/meta_2/${tokenName}.json`
        if (!fs.existsSync(oldFile)) continue
        console.log(tokenName)
        try {
            const info=await client.getTokenData(creator,collectionName,tokenName)
            console.log(`${tokenName} has uploaded`)
        }catch (e){
            console.log(`${tokenName}:${e}`)
            // arr.push(tokenName)
            const newFile=`/Users/daiwanwei/Projects/BAAC/APB_metadata/meta_7/${tokenName}.json`
            if (fs.existsSync(newFile)) continue
            fs.copyFile(oldFile, newFile, (err) => {
                if (err) throw err;
                console.log(`${oldFile} was copied to ${newFile}`);
            });
        }
    }
}

export async function compareFile(
    client:TokenClient, collectionName:string,creator:string
){
    for (let i=540;i<=3333;i++) {
        const tokenName = `Aptos Polar Bears #${i}`
        // const tokenName="Aptos Polar Bears #187"
        const file1 = `/Users/daiwanwei/Projects/BAAC/APB_metadata/apb_metadata/${tokenName}.json`
        const file2 = `/Users/daiwanwei/Projects/BAAC/APB_metadata/meta_2/${tokenName}.json`
        // if (fs.existsSync(file1)) {
            if (!fs.existsSync(file2)) {
                continue
            } else {
                try {
                    const info = await client.getTokenData(creator, collectionName, tokenName)
                    console.log(`${tokenName} has uploaded`)
                } catch (e) {
                    console.log(`${tokenName}:${e}`)
                    // arr.push(tokenName)
                    const newFile = `/Users/daiwanwei/Projects/BAAC/APB_metadata/meta_8/${tokenName}.json`
                    if (fs.existsSync(newFile)) continue
                    fs.copyFile(file1, newFile, (err) => {
                        if (err) throw err;
                        console.log(`${file1} was copied to ${newFile}`);
                    });
                }
            }
        }
    // }
}


export function moveFile(){

    const tokenNames=[
        "Aptos Polar Bears #2266","Aptos Polar Bears #2674",
        "Aptos Polar Bears #2081","Aptos Polar Bears #2225",
        "Aptos Polar Bears #2374","Aptos Polar Bears #2896",
        "Aptos Polar Bears #2354","Aptos Polar Bears #2003",
        "Aptos Polar Bears #2082","Aptos Polar Bears #2732",
        "Aptos Polar Bears #2937",
        "Aptos Polar Bears #2220",
        "Aptos Polar Bears #2629","Aptos Polar Bears #2697",
        "Aptos Polar Bears #2186","Aptos Polar Bears #2713",
        "Aptos Polar Bears #2063","Aptos Polar Bears #2469",
        "Aptos Polar Bears #2636",
        "Aptos Polar Bears #2045","Aptos Polar Bears #2319",
        "Aptos Polar Bears #2144","Aptos Polar Bears #2168",
        "Aptos Polar Bears #2408","Aptos Polar Bears #2544",
        "Aptos Polar Bears #2468",
        "Aptos Polar Bears #2238","Aptos Polar Bears #2552",
        "Aptos Polar Bears #2164",
        "Aptos Polar Bears #2185",
        "Aptos Polar Bears #2241","Aptos Polar Bears #2396"
    ]
    for (let tokenName of tokenNames){
        // const tokenName="Aptos Polar Bears #187"
        const oldFile=`/Users/daiwanwei/Projects/BAAC/APB_metadata/meta_4/${tokenName}.json`

        const newFile=`/Users/daiwanwei/Projects/BAAC/APB_metadata/meta_6/${tokenName}.json`
        if (fs.existsSync(newFile)) continue
        fs.copyFile(oldFile, newFile, (err) => {
            if (err) throw err;
            console.log(`${oldFile} was copied to ${newFile}`);
        });
    }
}


export function checkJsonFile(dir:string){
    const filenameList= fs.readdirSync(dir)
    for (let f of filenameList){
        if (f.split('.').pop()!=="json") continue;
        const filepath=`${dir}/${f}`
        console.log(`filepath(${filepath})`)
        const info= JSON.parse(fs.readFileSync(filepath).toString())
    }
}
