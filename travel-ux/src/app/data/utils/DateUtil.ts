
function getUtcNow() : Date {
    let date:Date = new Date(); 
    let now_utc:number =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    return new Date(now_utc);
}

export function dateFromString(dateStr:string|undefined) : Date {
    if(dateStr){
        return new Date(dateStr);
    } else {
        return new Date();
    }
}
    


export function dateTimeIsPast(date:Date) : boolean {
    let dateNow:Date = getUtcNow();
    return date.getTime() <= dateNow.getTime();
}

export function dateTimeStrIsPast(date:string) : boolean {
    return dateTimeIsPast(dateFromString(date));
}