const fetchData = (callback) => {
    setTimeout(() => {
        callback('Done!');
    }, 1500);
};

const fetchDataWithPromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done!');
        }, 1500);
    });
};

setTimeout(() => {
    console.log('Timer is done!');
    fetchDataWithPromise()
        .then((text) => {
            console.log(text);

            return fetchDataWithPromise();
        })
        .then((text) => {
            console.log(text);
        });
}, 2000);

// Will be executed first
console.log('Hi!');
console.log('Hello!');
