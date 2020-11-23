import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AccountTransactionModule } from '../src/account-transaction/account-transaction.module';
import { UsersModule } from '../src/users/users.module';
import { AccountBalancesModule } from '../src/account-balances/account-balances.module';
import { UserCreateOrUpdateDto, UserDto } from '../src/users/userDto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountDepositTransactionDto,
  AccountTransactionDto,
  AccountTransferTransactionDto,
  AccountWithDrawlTransactionDto,
} from '../src/account-transaction/account-transaction.dtos';
import { AccountBalance } from '../src/account-balances/account-balances.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const mongodb = new MongoMemoryServer();

  beforeEach(async () => {
    process.env.MONGO_URI = await mongodb.getUri();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          process.env.MONGO_URI,
          { useFindAndModify: false }
        ),
        AppModule,
        UsersModule,
        AccountTransactionModule,
        AccountBalancesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await mongodb.stop();
  });

  it('/ping (GET)', () => {
    return request(app.getHttpServer())
      .get('/ping')
      .expect(200)
      .expect('pong');
  });

  it('/users (GET)', async () => {
    let response = await request(app.getHttpServer())
      .post('/users/')
      .send(userMock1);
    expect(response.status).toEqual(201);

    response = await request(app.getHttpServer()).get('/users');
    expect(response.status).toEqual(200);
    const users = response.body as UserDto[];
    expect(users.length).toEqual(1);
  });

  it('POST /account-transactions/deposit', async () => {
    const depositTax = 0.005;
    const value = 100;
    const expectedBalance = value * depositTax + value;

    const user1 = await createUser(userMock1);

    await deposit(user1._id, value);

    const balances = await getBalanceByUserId(user1._id);
    expect(balances).not.toBeNull()
    expect(balances[0].balance).toEqual(expectedBalance)
  });

  it('POST /account-transactions/withdraw', async () => {
    const depositTax = 0.005;
    const withdrawTax = 0.01;
    const depositValue = 100;
    const withdrawValue = 50;
    const expectedBalance = (depositValue + depositValue * depositTax) - (withdrawValue + withdrawValue * withdrawTax);

    const user1 = await createUser(userMock1);

    await deposit(user1._id, depositValue);
    await withdraw(user1._id, withdrawValue);

    const balances = await getBalanceByUserId(user1._id);
    expect(balances).not.toBeNull()
    expect(balances[balances.length-1].balance).toEqual(expectedBalance)
  });

  it('POST /account-transactions/transfer', async () => {
    const depositValue = 100;
    const transferValue = 50;

    const user1 = await createUser(userMock1);
    const user2 = await createUser(userMock2);

    await deposit(user1._id, depositValue);
    await transfer(user1._id, user2._id, transferValue);

    const user1Balances = await getBalanceByUserId(user1._id);
    const user2Balances = await getBalanceByUserId(user2._id);

    expect(user1Balances).not.toBeNull();
    expect(user2Balances).not.toBeNull();
  });

  async function createUser(userMock: UserCreateOrUpdateDto): Promise<UserDto> {
    let response = await request(app.getHttpServer())
      .post('/users/')
      .send(userMock);
    expect(response.status).toEqual(201);

    return response.body as UserDto;
  }

  async function transfer(fromUserId: string, toUserId: string, value: number): Promise<AccountTransactionDto> {
    const requestBody: AccountTransferTransactionDto = {
      value: value,
      fromUserId: fromUserId,
      toUserId: toUserId
    }

    let response = await request(app.getHttpServer())
      .post('/account-transactions/transfer')
      .send(requestBody);
    expect(response.status).toEqual(201);

    const transaction = response.body as AccountTransactionDto;
    expect(transaction).not.toBeNull()
    expect(transaction.value).toEqual(value);

    return transaction;
  }

  async function deposit(userId: string, value: number): Promise<AccountTransactionDto> {
    const requestBody: AccountDepositTransactionDto = {
      value: value,
      userId: userId
    }

    let response = await request(app.getHttpServer())
      .post('/account-transactions/deposit')
      .send(requestBody);
    expect(response.status).toEqual(201);

    const transaction = response.body as AccountTransactionDto;
    expect(transaction).not.toBeNull()
    expect(transaction.value).toEqual(value);

    return transaction;
  }

  async function withdraw(userId: string, value: number): Promise<AccountTransactionDto> {
    const requestBody: AccountWithDrawlTransactionDto = {
      value: value,
      userId: userId
    }

    let response = await request(app.getHttpServer())
      .post('/account-transactions/withdraw')
      .send(requestBody);
    expect(response.status).toEqual(201);

    const transaction = response.body as AccountTransactionDto;
    expect(transaction).not.toBeNull()
    expect(transaction.value).toEqual(value);

    return transaction;
  }

  async function getBalanceByUserId(userId: string): Promise<AccountBalance[]> {
    let response = await request(app.getHttpServer())
      .get(`/account-balances?userId=${userId}`)
    expect(response.status).toEqual(200);
    const balances = response.body as AccountBalance[];
    expect(balances).not.toBeNull()

    return balances;
  }
});

const userMock1: UserCreateOrUpdateDto ={
  name: 'alice',
  cpf: '123'
}

const userMock2: UserCreateOrUpdateDto ={
  name: 'bob',
  cpf: '321'
}
