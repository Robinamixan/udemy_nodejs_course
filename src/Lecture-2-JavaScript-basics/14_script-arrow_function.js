const NAME = 'Fiodar';
let age = 26;
let hasHobbies = false;

age = 27;
const summarizeUserData = function (userName, userAge, userHasHobbies) {
    return 'User name is ' + userName + ', user age is ' + userAge + ', user has hobbies: ' + userHasHobbies;
}

// helps with 'this'
const summarizeUserData2 = (userName, userAge, userHasHobbies) => {
    return 'User name is ' + userName + ', user age is ' + userAge + ', user has hobbies: ' + userHasHobbies;
}

const add = (a, b) => a + b;
const addOne = a => a + 1;
const addRandom = () => 7 + 8;

console.log(add(1, 2));
console.log(addOne(4));
console.log(addRandom());
console.log(summarizeUserData(NAME, age, hasHobbies));
