import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const tours = Array.from({ length: 50 }).map(() => ({
    title: faker.location.city() + " Tour",
    image: faker.image.urlPicsumPhotos(),
    rating: Number(faker.number.float({ min: 3, max: 5 }).toFixed(1)),
    reviews: faker.number.int({ min: 10, max: 500 }),
    location: faker.location.country(),
    price: faker.number.int({ min: 50, max: 500 }),
    duration: faker.number.int({ min: 1, max: 7 }),
    experiences: faker.number.int({ min: 1, max: 10 }),
    description: faker.lorem.sentence(),
    language: ["English", "Bangla"],
    ageGroup: "18+",
    includes: ["Guide", "Food"],
    freeBooking: faker.datatype.boolean(),
    premiumInclusion: faker.datatype.boolean(),
    tourType: "Adventure",
    region: "Asia",
    adventureStyle: ["Nature"]
  }));

  await prisma.tour.createMany({
    data: tours,
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("Fake data inserted 🚀"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());