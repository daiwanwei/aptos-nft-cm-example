import type {Arguments, CommandBuilder} from 'yargs';
import {createCandyMachine, createCollection} from "../../candyMachine";
import {fundAccount, loadCreatorAccount, loadMinterAccount} from "../../helpers";
import {AptosAccount, AptosClient} from "aptos";
import {NODE_URL} from "../../config";
import fs from "fs";

type Options = {
};

export const command: string = 'generate';
export const desc: string = 'generate account';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs


export async function handler(argv: Arguments<Options>): Promise<void> {
    const account=new AptosAccount()
    console.log(account.toPrivateKeyObject())
    process.exit(0);
};
