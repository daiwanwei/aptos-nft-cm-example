import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection} from "../../candyMachine";
import {loadCreatorAccount} from "../../helpers";
import {AptosClient} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";
import {logger} from "../../logger";

type Options = {
    infoPath:string
};

export const command: string = 'createCollection';
export const desc: string = 'create candy machine';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .option('infoPath', {
            alias: "infoPath",
            type: 'string',
            demandOption: true,
            describe: 'collection info file path',
            default:"/Users/daiwanwei/Projects/aptos_ex/aptos-nft-cm-example/collectionInfo.json"
        })


interface Info{
    collectionName:string
    description:string,
    uri:string,
    maxSupply:bigint,
    mintFee:bigint,
    maxSupplyPerUser:bigint,
    presaleMintTime:number,
    publicMintTime:number,
}

export async function handler(argv: Arguments<Options>): Promise<void> {
    const {
        infoPath
    }=argv
    const info= JSON.parse(fs.readFileSync(infoPath).toString()) as Info
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
            logger.info(`createCm txn success,(${res})`)
        }else {
            //@ts-ignore
            logger.error(`createCm txn fail,(${receipt.vm_status})`)
        }
    }catch (e){
        logger.error(`createCm txn fail,(${e})`)
    }
    process.exit(0);
};
