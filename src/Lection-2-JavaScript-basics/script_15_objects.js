const person = {
    name: 'Fiodar',
    age: 26,
    greetWrong: () => {
        console.log('Hi, I am ' + this.name);
    },
    greet() {
        console.log('Hi, I am ' + this.name);
    }
};

person.greet();
