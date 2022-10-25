import type { Arguments, CommandBuilder } from 'yargs';

export const command: string = 'account <command>';
export const desc: string = 'account use case';

type Options = {
    command: string;
};

export const builder: CommandBuilder<Options,Options> = (yargs) =>
    yargs
        .commandDir('./accountCmds')

export  function handler(argv: Arguments<Options>){
};
