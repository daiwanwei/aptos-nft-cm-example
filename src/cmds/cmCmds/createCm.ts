import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine} from "../../candyMachine";
import {loadCreatorAccount} from "../../helpers";
import {AptosClient, TxnBuilderTypes} from "aptos";
import {NODE_URL} from "../../config";
import {logger} from "../../logger";

type Options = {
};

export const command: string = 'createCm';
export const desc: string = 'create candy machine';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs

export async function handler(argv: Arguments<Options>): Promise<void> {
    const account=loadCreatorAccount()
    const aptosClient=new AptosClient(NODE_URL)
    try {
        const res=await createCandyMachine(aptosClient,account)
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
