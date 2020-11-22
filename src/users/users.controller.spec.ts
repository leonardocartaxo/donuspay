import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserCreateOrUpdateDto } from './user.dtos';
import { HttpStatus } from '@nestjs/common';

describe('Test UsersController', () => {
  const mongodb = new MongoMemoryServer();

  let service: UsersService;
  let controller: UsersController;

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
      controllers: [UsersController],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  afterEach(async () => {
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('POST /users ', async () => {
    const userDto = await controller.create(userMock1);
    expect(userDto.name).toEqual(userMock1.name);
  });

  it('POST /users - unique cpf', async () => {
    try {
      await controller.create(userMock1);
      await controller.create(userMock1);
    } catch (e) {
      expect(e.status).toEqual(HttpStatus.BAD_REQUEST)
      expect(e.message).toContain('duplicate key error');
    }
  });

  it('GET /users', async () => {
    await controller.create(userMock1);
    await controller.create(userMock2);

    const users = await controller.findAll();

    expect(users.length).toEqual(2)
  });

  it('GET /users/{id}', async () => {
    const createdUser = await controller.create(userMock1);

    const foundUser = await controller.findOne(createdUser._id)

    expect(foundUser._id).toEqual(createdUser._id)
  });

  it('PUT /users/{id}', async () => {
    const createdUser = await controller.create(userMock1);

    const newName = "John"
    createdUser.name = newName;

    const updatedUser = await controller.update(createdUser._id, createdUser)

    expect(updatedUser.name).toEqual(newName)
  });

  it('DELETE /users/{id}', async () => {
    const createdUser = await controller.create(userMock1);

    await controller.delete(createdUser._id)

    const users = await controller.findAll();

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
