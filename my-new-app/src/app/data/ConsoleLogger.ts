import { Logger } from "./logger";
//design pattern singleton
export class ConsoleLogger implements Logger{
    public log(message:string): void{
        console.log(message);
    }
}