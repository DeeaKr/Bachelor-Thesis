import { LoggerFactory } from "./loggerFactory";

const logger=LoggerFactory.getInstance();
//design pattern decorator
export function logFunction(){
    return function(target:any, propertyKey:string, descriptor: PropertyDescriptor){
        const targetMethod= descriptor.value;

        descriptor.value = function(...args:any[]){
            logger.log(`Calling ${propertyKey}`);
            return targetMethod.apply(this, args);
        }
        return descriptor;
    }
}