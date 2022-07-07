/* interface TestProps {
    _id: string;
    name: string;
}

const testData : TestProps[] = [{_id: '156', name: 'a'}, {_id: '2001', name: 'bb'}];
 */
export default function arrToObj<T extends { _id?: string}>(arr: Array<T>) {
    // prev 初始为一个空对象，为其添加以 _id 为索引， currentObj 为对象的数据
    return arr.reduce((prev, current) => {
        if(current._id){
            prev[current._id] = current
        }
        return prev;
    }, {} as { [key: string]: T })
}

/* const result = arrToObj(testData);
console.log(result); */