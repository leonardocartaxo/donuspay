import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserCreateOrUpdateDto } from './userDto';
import { HttpStatus } from '@nestjs/common';

describe('Test UsersService', () => {
  const mongodb = new MongoMemoryServer();

  let service: UsersService;

  beforeEach(async () => {
    await mongodb.stop();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          await mongodb.getUri(),
          { useFindAndModify: false }
        ),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('POST /users ', async () => {
    const userDto = await service.create(userMock1);
    expect(userDto.name).toEqual(userMock1.name);
  });

  it('POST /users - unique cpf', async () => {
    try {
      await service.create(userMock1);
      await service.create(userMock1);
    } catch (e) {
      expect(e.status).toEqual(HttpStatus.BAD_REQUEST)
      expect(e.message).toContain('duplicate key error');
    }
  });

  it('GET /users', async () => {
    await service.create(userMock1);
    await service.create(userMock2);

    const users = await service.findAll();

    expect(users.length).toEqual(2)
  });

  it('GET /users/{id}', async () => {
    const createdUser = await service.create(userMock1);

    const foundUser = await service.findById(createdUser._id)

    expect(foundUser._id).toEqual(createdUser._id)
  });

  it('PUT /users/{id}', async () => {
    const createdUser = await service.create(userMock1);

    const newName = "John"
    createdUser.name = newName;

    const updatedUser = await service.update(createdUser._id, createdUser)

    expect(updatedUser.name).toEqual(newName)
  });

  it('DELETE /users/{id}', async () => {
    const createdUser = await service.create(userMock1);

    await service.delete(createdUser._id)

    const users = await service.findAll();

    expect(users.length).toEqual(0)
  });
});

const userMock1: UserCreateOrUpdateDto ={
  name: 'test',
  cpf: '123'
}

const userMock2: UserCreateOrUpdateDto ={
  name: 'test',
  cpf: '321'
}
