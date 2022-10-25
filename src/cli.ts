import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

yargs(hideBin(process.argv))
    // Use the commands directory to scaffold.
    .commandDir('cmds')
    // Default command if none supplied - shows help.
    .strict()
    // Useful aliases.
    .argv;
