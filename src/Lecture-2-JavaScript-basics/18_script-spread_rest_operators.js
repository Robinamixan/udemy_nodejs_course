const person = {
    name: 'Fiodar',
    age: 26,
    greet() {
        console.log('Hi, I am ' + this.name);
    }
};

person.greet();

const copiedPerson = {...person};
console.log(copiedPerson);

const hobbies = ['Sport', 'Books'];
const copiedArrayByFunction = hobbies.slice();
const copiedArrayBySpread = [...hobbies];
console.log(copiedArrayBySpread);

const toArrayWithRest = (...args) => {
    return args;
};
console.log(toArrayWithRest(1, 2, 3, 4, 5));
