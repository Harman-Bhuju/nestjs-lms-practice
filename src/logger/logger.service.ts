import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLoggerService implements LoggerService{

    /**
         * Write a 'log' level log.
         */
        log(message: any, ...optionalParams: any[]){
            console.log(message)
        }
        /**
         * Write an 'error' level log.
         */
        error(message: any, ...optionalParams: any[]){
            console.log(message)
        }
        /**
         * Write a 'warn' level log.
         */
        warn(message: any, ...optionalParams: any[]){
            console.log(message)
        }
        /**
         * Write a 'debug' level log.
         */
        debug?(message: any, ...optionalParams: any[]){
            console.log(message)
        }
        /**
         * Write a 'verbose' level log.
         */
        verbose?(message: any, ...optionalParams: any[]){
            console.log(message)
        }
        /**
         * Write a 'fatal' level log.
         */
        fatal?(message: any, ...optionalParams: any[]){
            console.log(message)
        }

}
