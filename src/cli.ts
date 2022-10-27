import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {config} from "dotenv"
import {logger} from "./logger";

config()

yargs(hideBin(process.argv))
    // Use the commands directory to scaffold.
    .commandDir('cmds')
    // Default command if none supplied - shows help.
    .strict()
    // Useful aliases.
    .argv;
