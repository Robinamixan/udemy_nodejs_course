const person = {
    name: 'Fiodar',
    age: 26,
    greet() {
        console.log('Hi, I am ' + this.name);
    }
};

person.greet();

// Stores only pointer to array in memory so array could be changed
const hobbies = ['Sport', 'Books'];
for (let hobby of hobbies) {
    console.log(hobby);
}

console.log(hobbies.map(hobby => 'Hobby: ' + hobby));
console.log(hobbies);

hobbies.push('Programming');
console.log(hobbies);
