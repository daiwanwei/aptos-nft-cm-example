import {AptosAccount, AptosClient, HexString, TxnBuilderTypes} from "aptos";
import {fundAccount, loadCreatorAccount, loadMinterAccount} from "./helpers";
import {NODE_URL} from "./config";
import {createCandyMachine, createCollection, mintTokens, uploadNFT} from "./candyMachine";

async function main() {
    console.log(`hello`)
    // const account=loadCreatorAccount()
    const account=new AptosAccount()
    console.log(account.toPrivateKeyObject())
    await fundAccount(account.address().hex(),100_000_000)
    const aptosClient=new AptosClient(NODE_URL)

    /*step 1:
    * createCandyMachine
    * */

    // const res1=await createCandyMachine(aptosClient,account)

    /*step 2:
    * createCandyMachine
    * */
    // const createCollectionReq={
    //     name:"Daiwanwei-3",
    //     description:"daiwanwei first token!",
    //     uri:"https://github.com/daiwanwei",
    //     maxSupply:10n,
    //     mintFee:1n,
    //     presaleMintTime:1666197642,
    //     publicMintTime:1666197642,
    // }
    // const res2=await createCollection(aptosClient,account,createCollectionReq)


    // let tokenNames=[]
    // let uris=[]
    // let descriptions=[]
    // let propertyKeys:string[][]=[]
    // let propertyValues:number[][][]=[]
    // let propertyTypes:string[][]=[]
    // for (let i=0;i<10;i++){
    //     const uri=`uri_${i}`
    //     const name=`name_${i}`
    //     const description=`description_${i}`
    //     uris.push(uri)
    //     tokenNames.push(name)
    //     descriptions.push(description)
    //     const attributes=[
    //         {key:`woo${i}`,value:i},
    //         {key:`woo2${i}`,value:(i+1)}
    //     ]
    //     let pTmp=[]
    //     let vTmp=[]
    //     let tTmp=[]
    //     for (let attribute of attributes){
    //         pTmp.push(attribute.key)
    //         vTmp.push([attribute.value])
    //         tTmp.push("String")
    //     }
    //     console.log(pTmp)
    //     propertyKeys.push(pTmp)
    //     propertyValues.push(vTmp)
    //     propertyTypes.push(tTmp)
    // }
    // // console.log(tokenNames.length)
    // // console.log(uris.length)
    // // console.log(propertyValues.length)
    // const uploadNFTReq={
    //     creator: TxnBuilderTypes.AccountAddress.fromHex(account.address()),
    //     collectionName:"Daiwanwei-3",
    //     tokenNames,
    //     descriptions,
    //     uris,
    //     propertyKeys,
    //     propertyValues,
    //     propertyTypes,
    // }
    //
    // const res3=await uploadNFT(aptosClient,account,uploadNFTReq)
    // const receipt =await aptosClient.waitForTransactionWithResult(res3)
    // //@ts-ignore
    // const isSuccess=receipt.success
    // if (isSuccess){
    //     console.log(`txn success,${res3}`)
    // }else {
    //     //@ts-ignore
    //     console.log(`txn fail,${receipt.vm_status}`)
    // }
    /*step 4:
    * createCandyMachine
    * */
    // const minterAccount=loadMinterAccount()
    // await fundAccount(minterAccount.address().hex(),1_000_000_000_000)
    // console.log(minterAccount.address())
    // const creator=new HexString("0x30957ce23fa2e31cb10766e27e950cf8aa2245e3273f2e18b2ef84ad4870cd9e")
    // const mintTokensReq={
    //     // creator: TxnBuilderTypes.AccountAddress.fromHex(creator),
    //     creator: TxnBuilderTypes.AccountAddress.fromHex(account.address()),
    //     collectionName:"Daiwanwei-3",
    //     amount:1n,
    // }
    // const res4=await mintTokens(aptosClient,minterAccount,mintTokensReq)
}

main()
    .then(()=>console.log(`execute successfully`))
    .catch((err)=>{
        console.log(`execute fail,err:${err}`)
        process.exitCode=1
    })
