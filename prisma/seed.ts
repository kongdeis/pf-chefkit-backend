import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'


const prisma = new PrismaClient();


async function main() {
  const initPassword = process.env.ADMIN_INIT_PASSWORD;
  if (!initPassword) {
    throw new Error('환경 변수에 ADMIN_INIT_PASSWORD가 정의되지 않았습니다.');
  }
  const password = await bcrypt.hash(initPassword, 10);

  const admin = await prisma.member.upsert({
    where: {email: 'admin@chefkit.com'},
    update: {},
    create: {
      email: 'admin@chefkit.com',
      password,
      name: '최고관리자',
      role: 'ADMIN'
    }
  });
  console.log(`seed 완료: ${admin.email}`)
}

main()
  .catch((e) => {
    console.log('seed 에러 발생', e);
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


