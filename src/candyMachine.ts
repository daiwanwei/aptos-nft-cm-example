import {AptosAccount, AptosClient, BCS, TxnBuilderTypes} from "aptos";

import {logger} from "./logger";

const CANDY_MACHINE_MODULE_ADDRESS=`0xdf5c814388f4162f353e14f6123fcba8f39a958e4a2640e38e9e2c7cdfd2ac1d::candy_machine_v2`

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
    logger.info(`createCandyMachine submit tx(${pendingTx.hash})`)
    return pendingTx.hash
}

export interface CreateCollectionReq{
    name:string
    description:string
    uri:string
    maxSupply:bigint
    maxSupplyPerUser:bigint
    mintFee:bigint
    presaleMintTime:number
    publicMintTime:number
}

export async function createCollection(
    client:AptosClient,account:AptosAccount,req:CreateCollectionReq,
) {
    const {
        name, description, uri,maxSupply, maxSupplyPerUser,
        mintFee, presaleMintTime, publicMintTime,
    }=req
    const mutateSetting=[true,true,true]
    const setting=BCS.serializeVectorWithFunc(mutateSetting,"serializeBool")
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            CANDY_MACHINE_MODULE_ADDRESS,
            "create_collection",
            [], [
                BCS.bcsSerializeStr(name),
                BCS.bcsSerializeStr(description),
                BCS.bcsSerializeStr(uri),
                BCS.bcsSerializeUint64(maxSupply),
                setting,
                BCS.bcsSerializeBool(true),
                BCS.bcsSerializeUint64(maxSupplyPerUser),
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
    logger.info(`createCollection submit tx(${pendingTx.hash})`)
    return pendingTx.hash
}

export interface UploadNFTReq{
    collectionName:string
    tokenNames:string[]
    descriptions:string[]
    uris:string[]
    creator:TxnBuilderTypes.AccountAddress
    propertyKeys:string[][]
    propertyValues:number[][][]
    propertyTypes:string[][]
}


export async function uploadNFT(
    client:AptosClient,account:AptosAccount,req:UploadNFTReq,
) {
    const {
        collectionName, tokenNames,descriptions,creator,
        uris,propertyKeys,propertyValues,propertyTypes
    }=req
    // const creator=TxnBuilderTypes.AccountAddress.fromHex(account.address().hex())
    const keys=BCS.serializeVectorWithFunc(
        propertyKeys.map(key=>{
            return  BCS.serializeVectorWithFunc(key,"serializeStr")
        }),
    "serializeFixedBytes")

    const values=BCS.serializeVectorWithFunc(
        propertyValues.map(values=>{
            return  BCS.serializeVectorWithFunc(
                values.map(value=>BCS.serializeVectorWithFunc(value,"serializeU8")),
                "serializeFixedBytes"
            )
        }), "serializeFixedBytes")
    const types=BCS.serializeVectorWithFunc(
        propertyTypes.map(type=>BCS.serializeVectorWithFunc(type,"serializeStr")),
        "serializeFixedBytes")
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            CANDY_MACHINE_MODULE_ADDRESS,
            "upload_nft",
            [], [
                BCS.bcsSerializeStr(collectionName),
                BCS.serializeVectorWithFunc(tokenNames,"serializeStr"),
                BCS.serializeVectorWithFunc(descriptions,"serializeStr"),
                BCS.serializeVectorWithFunc(uris,"serializeStr"),
                BCS.bcsToBytes(creator),
                BCS.bcsSerializeUint64(1000),
                BCS.bcsSerializeUint64(1),
                BCS.serializeVectorWithFunc([true,true,true,true,true],"serializeBool"),
                keys,
                values,
                types,
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
    logger.info(`uploadNFT submit tx(${pendingTx.hash})`)
    return pendingTx.hash
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
    logger.info(`mintTokens submit tx(${pendingTx.hash})`)
    return pendingTx.hash
}

export async function updateMintFee(
    client:AptosClient,account:AptosAccount,
    collectionName:string,mintFee:bigint
) {
    console.log(collectionName)
    console.log(mintFee)
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            CANDY_MACHINE_MODULE_ADDRESS,
            "set_mint_fee",
            [], [
                BCS.bcsSerializeStr(collectionName),
                BCS.bcsSerializeUint64(mintFee),
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
    logger.info(`updateMintFee submit tx(${pendingTx.hash})`)
    return pendingTx.hash
}

export async function updateWhitelist(
    client:AptosClient,account:AptosAccount,collectionName:string,
    addresses:TxnBuilderTypes.AccountAddress[],mintAmounts:bigint[]
) {
    const addressSerializer=new BCS.Serializer()
    addressSerializer.serializeU32AsUleb128(addresses.length);
    addresses.forEach((addr)=>{
        addr.serialize(addressSerializer)
    })
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            CANDY_MACHINE_MODULE_ADDRESS,
            "update_whitelist",
            [], [
                BCS.bcsSerializeStr(collectionName),
                addressSerializer.getBytes(),
                // BCS.serializeVectorWithFunc(addresses,"serialize"),
                BCS.serializeVectorWithFunc(mintAmounts,"serializeU64"),
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
    logger.info(`updateWhitelist submit tx(${pendingTx.hash})`)
    return pendingTx.hash
}
