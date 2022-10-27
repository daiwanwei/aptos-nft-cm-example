import {config} from "dotenv";
config()
import {AptosClient, BCS, TokenClient, TokenTypes, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../src/config";
import {checkJsonFile, loadMinterAccount, moveFile} from "../src/helpers";
import * as utf8 from "utf8";

describe("aptos token test",()=>{
    const aptosClient=new AptosClient(NODE_URL)
    const tokenClient=new TokenClient(aptosClient)
    const creator="0xd5efd09ff3954845c23428667c63c366d7d88c2a77830063ec0f8d982d56a623"
    const collectionName="Aptos Polar Bears"
    const tokenName=`${collectionName} #95`

    test("collection info", async ()=>{
        const info = await tokenClient.getCollectionData(creator,collectionName)
        console.log(info)
    })

    test("collection info", async ()=>{
        const minter=loadMinterAccount()
        // const info = await tokenClient.directTransferToken(
        //     creator,collectionName
        // )
        // console.log(info)
    })

    test("collection1 info", async ()=>{
        const creator="0xa04617276be5216b99f035989d226e006d5e93368a85dc69e79f1e8f4da5da1a"
        const collectionName="Aptos Cute Bears"
        const info = await tokenClient.getCollectionData(creator,collectionName)
        console.log(info)
    })

    test("token info", async ()=>{
        // const creator="0xa04617276be5216b99f035989d226e006d5e93368a85dc69e79f1e8f4da5da1a"
        // const collectionName="Aptos Cute Bears"
        const tokenName="Aptos Polar Bears ##2068"
        const info = await tokenClient.getTokenData(creator,collectionName,tokenName)
        console.log(info)
        //@ts-ignore
        console.log(JSON.stringify(info.default_properties))
    })

    test("token1 info", async ()=>{
        // const creator="0xa04617276be5216b99f035989d226e006d5e93368a85dc69e79f1e8f4da5da1a"
        // const collectionName="Aptos Cute Bears"
        const tokenNames=[
            "Aptos Polar Bears #2266","Aptos Polar Bears #2674",
            "Aptos Polar Bears #2081","Aptos Polar Bears #2225",
            "Aptos Polar Bears #2374","Aptos Polar Bears #2896",
            "Aptos Polar Bears #2354","Aptos Polar Bears #2003",
            "Aptos Polar Bears #2082","Aptos Polar Bears #2732",
            "Aptos Polar Bears #2937","Aptos Polar Bears #2095",
            "Aptos Polar Bears #2220",
            "Aptos Polar Bears #2629","Aptos Polar Bears #2697",
            "Aptos Polar Bears #2186","Aptos Polar Bears #2713",
            "Aptos Polar Bears #2063","Aptos Polar Bears #2469",
            "Aptos Polar Bears #2636","Aptos Polar Bears #2548",
            "Aptos Polar Bears #2045","Aptos Polar Bears #2319",
            "Aptos Polar Bears #2144","Aptos Polar Bears #2168",
            "Aptos Polar Bears #2408","Aptos Polar Bears #2544",
            "Aptos Polar Bears #2468",
            "Aptos Polar Bears #2238","Aptos Polar Bears #2552",
            "Aptos Polar Bears #2068","Aptos Polar Bears #2164",
            "Aptos Polar Bears #2185",
            "Aptos Polar Bears #2241","Aptos Polar Bears #2396"
        ]
        for (let x of tokenNames) {
            try {

                const info = await tokenClient.getTokenData(
                    creator, collectionName, x
                )

            } catch (e) {
                console.log(e)
                console.log(x)
            }
        }
    })

    test("token2 info", async ()=>{
        moveFile()
    })

    test("token event info", async ()=>{
       const events=await aptosClient.getEventsByEventHandle(
           "8e6c826f27daf269e8294df86ec6a9d930a4cd672d6173080fc2d4fa9c0fdd02",
           "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
           "withdraw_events"
       )
        events.forEach((e)=>console.log(e))
    })

    test("token1 event info", async ()=>{
        checkJsonFile("/Users/daiwanwei/Projects/BAAC/APB_metadata/meta_4")
    })

    test("token mint", async ()=>{
        // const events=await tokenClient.ge(
        //     "8e6c826f27daf269e8294df86ec6a9d930a4cd672d6173080fc2d4fa9c0fdd02",
        //     "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
        //     "withdraw_events"
        // )
        // events.forEach((e)=>console.log(e))
    })

    test("get collection supply", async ()=>{
        const aptosClient=new AptosClient(NODE_URL)
        const tokenClient=new TokenClient(aptosClient)
        const creator="0xa04617276be5216b99f035989d226e006d5e93368a85dc69e79f1e8f4da5da1a"
        const collectionName="Aptos Cute Bears"
        const data = await tokenClient.getCollectionData(creator,collectionName)
        const {
            description,maximum,name,supply,uri
        }=data
        console.log(`MintedAmount:${supply}`)
        console.log(`TotalAmount:${maximum}`)
    })

    test("get token owner", async ()=>{
        const aptosClient=new AptosClient(NODE_URL)
        const user="0x8e6c826f27daf269e8294df86ec6a9d930a4cd672d6173080fc2d4fa9c0fdd02"
        const resourceType="0x3::token::TokenStore"
        const resource=await aptosClient.getAccountResource(user,resourceType)
        console.log(resource)
        const handle=(resource as any)["data"]["tokens"]["handle"]
        console.log(handle)
        const tokenId={
            token_data_id:{
                collection:"Daiwanwei-5",
                creator:"0xf624b6c619679da5a11010718d8eb2c6095a5be1e3206cc1827b59780a883f1e",
                name:"Daiwanwei-5 - #1"
            },
            property_version: "0",
        }
        const res2= await aptosClient.getTableItem(
            handle,{
                key_type: "0x3::token::TokenId",
                value_type: "0x3::token::Token",
                key: tokenId,
            })
        console.log(res2)
        //
        const res= await tokenClient.getTokenForAccount(user, tokenId);
        console.log(res)
    })

    test("get cm config", async ()=>{
        console.log(NODE_URL)
        const aptosClient=new AptosClient(NODE_URL)
        const resourceAccount="0xd5efd09ff3954845c23428667c63c366d7d88c2a77830063ec0f8d982d56a623"
        const resourceType="0x5ac985f1fe40c5121eb33699952ce8a79b1d1cb7438709dbd1da8e840a04fbee::candy_machine_v2::CollectionConfigs"
        const resource=await aptosClient.getAccountResource(resourceAccount,resourceType)
        console.log(resource)
        const handle=(resource as any)["data"]["collection_configs"]["handle"]
        // console.log(handle)
        // const tokenId={
        //     token_data_id:{
        //         collection:"Daiwanwei-5",
        //         creator:"0xf624b6c619679da5a11010718d8eb2c6095a5be1e3206cc1827b59780a883f1e",
        //         name:"Daiwanwei-5 - #1"
        //     },
        //     property_version: "0",
        // }
        const res2= await aptosClient.getTableItem(
            handle,{
                key_type: "0x1::string::String",
                value_type: "0x5ac985f1fe40c5121eb33699952ce8a79b1d1cb7438709dbd1da8e840a04fbee::candy_machine_v2::CollectionConfig",
                key: "Aptos Polar Bears",
            })
        console.log(res2)
        // //
        // const res= await tokenClient.getTokenForAccount(user, tokenId);
        // console.log(res)
    })
})
