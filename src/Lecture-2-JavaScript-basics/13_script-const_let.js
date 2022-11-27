const NAME = 'Fiodar';
let age = 26;
let hasHobbies = false;

age = 27;

function summarizeUserData(userName, userAge, userHasHobbies) {
    return 'User name is ' + userName + ', user age is ' + userAge + ', user has hobbies: ' + userHasHobbies;
}

console.log(summarizeUserData(NAME, age, hasHobbies));
