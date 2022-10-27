import type { Arguments, CommandBuilder } from 'yargs';

export const command: string = 'usecase <command>';
export const desc: string = 'candy machine use case';

type Options = {
    command: string;
};

export const builder: CommandBuilder<Options,Options> = (yargs) =>
    yargs
        .commandDir('./usecaseCmds')

export  function handler(argv: Arguments<Options>){
};
