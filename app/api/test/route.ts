import { prisma } from "../../lib/prisma"
import { faker } from '@faker-js/faker';

async function seedTour() {
  const tours = Array.from({ length: 50 }).map(() => ({
    title: faker.location.city() + " Tour",
    image: faker.image.urlPicsumPhotos(),
    rating: Number(faker.number.float({ min: 3, max: 5 }).toFixed(1)),
    reviews: faker.number.int({ min: 10, max: 500 }),
    location: faker.location.country(),
    originalPrice: faker.number.int({ min: 50, max: 500 }),
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


export async function GET() {
  try {
    console.log(" Trying to connect DB...")

    const data = await prisma.todo.findMany()

    console.log(" DB Connected, data:", data)
    seedTour()
  .then(() => console.log("Fake data inserted 🚀"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());

    return Response.json({ success: true, data })
  } catch (error) {
    console.log(" DB Error:", error)

    return Response.json({ success: false, error: String(error) })
  }
}