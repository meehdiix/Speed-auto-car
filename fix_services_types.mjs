import fs from 'fs';

let content = fs.readFileSync('src/components/Services.tsx', 'utf8');

// Change map type cast
content = content.replace(
  `const dbCars = snapshot.docs.map(doc => ({`,
  `const dbCars = snapshot.docs.map(doc => ({`
);

content = content.replace(
  `const dbCars = snapshot.docs.map(doc => ({\n        id: doc.id,\n        ...doc.data()\n      }));`,
  `const dbCars = snapshot.docs.map(doc => ({\n        id: doc.id,\n        ...(doc.data() as any)\n      }));`
);

fs.writeFileSync('src/components/Services.tsx', content);
