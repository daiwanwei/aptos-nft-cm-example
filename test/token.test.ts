// import {describe, expect, test} from '@jest/globals';
import {AptosClient, BCS, TokenClient, TokenTypes, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../src/config";
import {loadMinterAccount} from "../src/helpers";

describe("aptos token test",()=>{
    const aptosClient=new AptosClient(NODE_URL)
    const tokenClient=new TokenClient(aptosClient)
    const creator="0x125f95e8c69d0ac652a031bda65873431319ffe011d3c4db261dc9868ae6514c"
    const collectionName="Aptos Acid Apes 2"
    const tokenName=`${collectionName} #95`
    // beforeEach(()=>{
    //
    // })

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
        // const creator="0xa04617276be5216b99f035989d226e006d5e93368a85dc69e79f1e8f4da5da1a"
        // const collectionName="Aptos Cute Bears"
        const info = await tokenClient.getCollectionData(creator,collectionName)
        console.log(info)
    })

    test("token info", async ()=>{
        const info = await tokenClient.getTokenData(creator,collectionName,tokenName)
        console.log(info)
    })
    test("token event info", async ()=>{
       const events=await aptosClient.getEventsByEventHandle(
           "8e6c826f27daf269e8294df86ec6a9d930a4cd672d6173080fc2d4fa9c0fdd02",
           "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
           "withdraw_events"
       )
        events.forEach((e)=>console.log(e))
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
})
