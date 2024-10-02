


export const unique = (array:any[], propertyName:any) => {
    return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
}

export const delay = (ms:number) => {
    return new Promise(res => setTimeout(res, ms))
};