/* interface TestProps {
    _id: string;
    name: string;
}
const testData : {[ket: string]: TestProps} = {
    102: { _id: '102', name: 'aa'},
    2: { _id: '754', name: 'bb'}
} */

export default function objToArray<T>(obj: {[key: string]: T}) {
    return Object.keys(obj).map(key => obj[key]);
}

/* const result = objToArray(testData);
console.log(result); */