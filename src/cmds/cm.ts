import type { Arguments, CommandBuilder } from 'yargs';

export const command: string = 'cm <command>';
export const desc: string = 'candy machine use case';

type Options = {
    command: string;
};

export const builder: CommandBuilder<Options,Options> = (yargs) =>
    yargs
        .commandDir('./cmCmds')

export  function handler(argv: Arguments<Options>){
};
