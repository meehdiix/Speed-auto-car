const fs = require('fs');
const cars = JSON.parse(fs.readFileSync('cars_dump.json', 'utf8'));

// We just dump out the URLs per car so I can see them and group them.
cars.forEach(car => {
    console.log(`\n\n--- ${car.title} ---`);
    car.images.forEach(img => console.log(img));
});
