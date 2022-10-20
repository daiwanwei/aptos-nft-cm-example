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
