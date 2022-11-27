const person = {
    name: 'Fiodar',
    age: 26,
    greet() {
        console.log('Hi, I am ' + this.name);
    }
};

person.greet();
const printName = (personData) => {
    console.log(personData.name);
};
const printNameWithDestructuring = ({ name, age }) => {
    console.log(name);
};
printNameWithDestructuring(person);

const { name, age } = person;
console.log(name, age);

const hobbies = ['Sport', 'Books'];
const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);
