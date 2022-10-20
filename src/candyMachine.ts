import {AptosAccount, AptosClient, BCS, TxnBuilderTypes} from "aptos";

const CANDY_MACHINE_MODULE_ADDRESS=`0x5ac985f1fe40c5121eb33699952ce8a79b1d1cb7438709dbd1da8e840a04fbee::candy_machine_v2`
const U64_MAX=18446744073709551615n

export async function createCandyMachine(
    client:AptosClient,account:AptosAccount
) {
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            CANDY_MACHINE_MODULE_ADDRESS,
            "create_cm_v2",
            [], []
        )
    )
    const [{sequence_number: sequenceNumber}, chainId] = await Promise.all([
        client.getAccount(account.address()),
        client.getChainId()
    ])
    const expireAt = BigInt(Math.floor(Date.now() / 1000) + 10)
    const tx = new TxnBuilderTypes.RawTransaction(
        TxnBuilderTypes.AccountAddress.fromHex(account.address()),
        BigInt(sequenceNumber),
        payload,
        100000n,
        100n,
        expireAt,
        new TxnBuilderTypes.ChainId(chainId),
    )

    const bcsTx = AptosClient.generateBCSTransaction(account, tx);
    const pendingTx = await client.submitSignedBCSTransaction(bcsTx);
    console.log(`submit tx(${pendingTx.hash})`)
    return pendingTx.hash
}

export interface CreateCollectionReq{
    name:string
    description:string
    uri:string
    maxSupply:bigint
    mintFee:bigint
    presaleMintTime:number
    publicMintTime:number
}

export async function createCollection(
    client:AptosClient,account:AptosAccount,req:CreateCollectionReq,
) {
    const {
        name, description, uri, maxSupply,
        mintFee, presaleMintTime, publicMintTime,
    }=req
    const mutateSetting=[false,false,false]
    const setting=BCS.serializeVectorWithFunc(mutateSetting,"serializeBool")
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            CANDY_MACHINE_MODULE_ADDRESS,
            "create_collection",
            [], [
                BCS.bcsSerializeStr(name),
                BCS.bcsSerializeStr(description),
                BCS.bcsSerializeStr(uri),
                BCS.bcsSerializeUint64(U64_MAX),
                setting,
                BCS.bcsSerializeBool(true),
                BCS.bcsSerializeUint64(maxSupply),
                BCS.bcsSerializeUint64(mintFee),
                BCS.bcsSerializeUint64(publicMintTime),
                BCS.bcsSerializeUint64(presaleMintTime),
            ]
        )
    )
    const [{sequence_number: sequenceNumber}, chainId] = await Promise.all([
        client.getAccount(account.address()),
        client.getChainId()
    ])
    const expireAt = BigInt(Math.floor(Date.now() / 1000) + 10)
    const tx = new TxnBuilderTypes.RawTransaction(
        TxnBuilderTypes.AccountAddress.fromHex(account.address()),
        BigInt(sequenceNumber),
        payload,
        100000n,
        100n,
        expireAt,
        new TxnBuilderTypes.ChainId(chainId),
    )

    const bcsTx = AptosClient.generateBCSTransaction(account, tx);
    const pendingTx = await client.submitSignedBCSTransaction(bcsTx);
    console.log(`submit tx(${pendingTx.hash})`)
    return pendingTx.hash
}

export interface UploadNFTReq{
    creator:TxnBuilderTypes.AccountAddress
    collectionName:string
    tokenNames:string[]
    descriptions:string[]
    uris:string[]
    propertyKeys:string[][]
    propertyValues:number[][][]
    propertyTypes:string[][]
}


export async function uploadNFT(
    client:AptosClient,account:AptosAccount,req:UploadNFTReq,
) {
    const {
        creator, collectionName, tokenNames,descriptions,
        uris,propertyKeys,propertyValues,propertyTypes
    }=req
    const keys=BCS.serializeVectorWithFunc(
        propertyKeys.map(key=>{
            console.log(key)
            return  BCS.serializeVectorWithFunc(key,"serializeStr")
        }),
    "serializeBytes")

    const values=BCS.serializeVectorWithFunc(
        propertyValues.map(values=>{
            return  BCS.serializeVectorWithFunc(
                values.map(value=>BCS.serializeVectorWithFunc(value,"serializeU8")),
                "serializeBytes"
            )
        }),
        "serializeBytes")
    const types=BCS.serializeVectorWithFunc(
        propertyTypes.map(type=>BCS.serializeVectorWithFunc(type,"serializeStr")),
        "serializeBytes")

    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            CANDY_MACHINE_MODULE_ADDRESS,
            "mint_tokens",
            [], [
                BCS.bcsSerializeStr(collectionName),
                BCS.serializeVectorWithFunc(tokenNames,"serializeStr"),
                BCS.serializeVectorWithFunc(descriptions,"serializeStr"),
                BCS.serializeVectorWithFunc(uris,"serializeStr"),
                BCS.bcsToBytes(creator),
                BCS.bcsSerializeUint64(1),
                BCS.bcsSerializeUint64(1),
                BCS.serializeVectorWithFunc([false,false,false,false,false],"serializeBool"),
                keys,
                values,
                types
            ]
        )
    )
    const [{sequence_number: sequenceNumber}, chainId] = await Promise.all([
        client.getAccount(account.address()),
        client.getChainId()
    ])
    const expireAt = BigInt(Math.floor(Date.now() / 1000) + 10)
    const tx = new TxnBuilderTypes.RawTransaction(
        TxnBuilderTypes.AccountAddress.fromHex(account.address()),
        BigInt(sequenceNumber),
        payload,
        100000n,
        100n,
        expireAt,
        new TxnBuilderTypes.ChainId(chainId),
    )

    const bcsTx = AptosClient.generateBCSTransaction(account, tx);
    const pendingTx = await client.submitSignedBCSTransaction(bcsTx);
    console.log(`submit tx(${pendingTx.hash})`)
    return pendingTx.hash
    // return ""
}

export interface MintTokensReq{
    creator:TxnBuilderTypes.AccountAddress
    collectionName:string
    amount:bigint
}

export async function mintTokens(
    client:AptosClient,account:AptosAccount,req:MintTokensReq,
) {
    const {
        creator, collectionName, amount,
    }=req
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            CANDY_MACHINE_MODULE_ADDRESS,
            "mint_tokens",
            [], [
                BCS.bcsToBytes(creator),
                BCS.bcsSerializeStr(collectionName),
                BCS.bcsSerializeUint64(amount),
            ]
        )
    )
    const [{sequence_number: sequenceNumber}, chainId] = await Promise.all([
        client.getAccount(account.address()),
        client.getChainId()
    ])
    const expireAt = BigInt(Math.floor(Date.now() / 1000) + 10)
    const tx = new TxnBuilderTypes.RawTransaction(
        TxnBuilderTypes.AccountAddress.fromHex(account.address()),
        BigInt(sequenceNumber),
        payload,
        100000n,
        100n,
        expireAt,
        new TxnBuilderTypes.ChainId(chainId),
    )

    const bcsTx = AptosClient.generateBCSTransaction(account, tx);
    const pendingTx = await client.submitSignedBCSTransaction(bcsTx);
    console.log(`submit tx(${pendingTx.hash})`)
    return pendingTx.hash
}
