import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { v5 as uuidv5 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  /*
   * Seeding users with our group
   */
  const ewen = await prisma.user.upsert({
    where: { email: 'ewen.sellitto@epitech.eu' },
    update: {},
    create: {
      email: 'ewen.sellitto@epitech.eu',
      password: await argon.hash(process.env.SEED_PASSWORD),
      username: 'EwenS',
      firstName: 'Ewen',
      uuid: uuidv5('EwenS' + 'ewen.sellitto@epitech.eu', uuidv5.DNS),
      isOauth: false,
      isActivated: true,
      lastName: 'Sellitto',
    },
  });

  const florian = await prisma.user.upsert({
    where: { email: 'florian.minguet@epitech.eu' },
    update: {},
    create: {
      email: 'florian.minguet@epitech.eu',
      password: await argon.hash(process.env.SEED_PASSWORD),
      username: 'FlorianM',
      firstName: 'Florian',
      uuid: uuidv5('FlorianM' + 'florian.minguet@epitech.eu', uuidv5.DNS),
      isOauth: false,
      isActivated: true,
      lastName: 'Minguet',
    },
  });

  const valentin = await prisma.user.upsert({
    where: { email: 'valentin.duban@epitech.eu' },
    update: {},
    create: {
      email: 'valentin.duban@epitech.eu',
      password: await argon.hash(process.env.SEED_PASSWORD),
      username: 'ValentinD',
      firstName: 'Valentin',
      uuid: uuidv5('ValentinD' + 'valentin.duban@epitech.eu', uuidv5.DNS),
      isOauth: false,
      isActivated: true,
      lastName: 'Duban',
    },
  });

  const williamS = await prisma.user.upsert({
    where: { email: 'william.stoops@epitech.eu' },
    update: {},
    create: {
      email: 'william.stoops@epitech.eu',
      password: await argon.hash(process.env.SEED_PASSWORD),
      username: 'WilliamS',
      firstName: 'William',
      uuid: uuidv5('WilliamS' + 'william.stoops@epitech.eu', uuidv5.DNS),
      isOauth: false,
      isActivated: true,
      lastName: 'Stoops',
    },
  });

  const williamD = await prisma.user.upsert({
    where: { email: 'william.dromard@epitech.eu' },
    update: {},
    create: {
      email: 'william.dromard@epitech.eu',
      password: await argon.hash(process.env.SEED_PASSWORD),
      username: 'WilliamD',
      firstName: 'William',
      uuid: uuidv5('WilliamD' + 'william.dromard@epitech.eu', uuidv5.DNS),
      isOauth: false,
      isActivated: true,
      lastName: 'Dromard',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
