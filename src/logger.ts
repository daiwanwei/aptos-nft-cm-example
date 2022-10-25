import { createLogger, transports, format } from "winston";
import 'winston-daily-rotate-file'
const logFormat=format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.simple()
)

const transportList=[
    new transports.Console(),
    new transports.DailyRotateFile({
        dirname: './atpos-cm-err-log',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
        handleExceptions:true,
    }),
    new transports.DailyRotateFile({
        dirname: './atpos-cm-log',
        filename: 'combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        handleExceptions:true,
    }),
]

export const logger = createLogger({
    level: 'info',
    defaultMeta: { service: 'aptos-cm' },
    format: logFormat,
    transports:transportList,
});
