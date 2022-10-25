import {AptosAccount, FaucetClient} from "aptos";
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


export async function retryFn(retry:number,fn: (()=>Promise<boolean>)){
    for (let r=retry;r>0;r--){
        logger.info(`retry function : time(${5-r}.${retry})`)
        const isOk=await fn()
        if (isOk){
            logger.info(`retry successfully : time(${r}.${retry})`)
            break
        }
    }
}

