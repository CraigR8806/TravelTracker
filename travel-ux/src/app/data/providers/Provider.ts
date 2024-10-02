import { unique } from "../utils/Util";

interface KeyedConsumer {
    key:string,
    component:React.Component<any, any>
}

export interface ConsumerState {}

export abstract class Provider<T> {

    

    protected consumers:KeyedConsumer[] = [];

    notify = (property:string, value:T) => {
        this.consumers.forEach(consumer=>{
            consumer.component.setState({[property] : value});
        });
    }

    register = (component:React.Component<any, Partial<ConsumerState>>, key:string|undefined|null):string => {
        if(!key) {
            key = (Math.random()*9999).toString();
        }
        let tmpConsumers:KeyedConsumer[] = this.consumers;
        tmpConsumers.push({"key":key, "component":component});
        if(unique(tmpConsumers, "key").length > this.consumers.length) {
            this.consumers.push({"key":key, "component":component});
        }
        return key;
    }

    deregister = (key:string) => {
        this.consumers.splice(this.consumers.findIndex(consumer=>consumer.key === key), 1);
    }
}
