const fetchData1 = require('./test.js'); // Replace with the actual path to the module

(async () => {
    const data = await fetchData1(2); // Replace with the desired ID
    console.log(data);
})();