import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection} from "../../candyMachine";
import {fundAccount, loadCreatorAccount, loadMinterAccount} from "../../helpers";
import {AptosClient} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";

type Options = {
};

export const command: string = 'fund';
export const desc: string = 'fund aptos coin';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs


export async function handler(argv: Arguments<Options>): Promise<void> {

    const creator=loadCreatorAccount()
    const minter=loadMinterAccount()
    const aptosClient=new AptosClient(NODE_URL)
    await fundAccount(creator.address().hex(),100_000_000)
    await fundAccount(minter.address().hex(),100_000_000)
    process.exit(0);
};
