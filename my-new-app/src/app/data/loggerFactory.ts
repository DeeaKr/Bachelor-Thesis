import { ConsoleLogger } from "./ConsoleLogger";
import { Logger } from "./logger";

let logger: Logger;
//design pattern singleton
export class LoggerFactory{
    public static getInstance(): Logger{
        if(!logger){
            logger= new ConsoleLogger();
        }
        return logger;
    }
}