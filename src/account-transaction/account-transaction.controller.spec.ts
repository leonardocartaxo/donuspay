import { Test, TestingModule } from '@nestjs/testing';
import { AccountTransactionController } from './account-transaction.controller';
import { AccountTransactionType } from './account-transaction.schema';

describe('AccountTransactionController', () => {
  let controller: AccountTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountTransactionController],
    }).compile();

    controller = module.get<AccountTransactionController>(AccountTransactionController);
  });

  it('should be defined', async () => {
    const resp = await controller.create({
      transactionType: AccountTransactionType.deposit,
      value: 100,
      toUserId: '5fb1a1d56d4a144500e169a4'
    })
    expect(resp.value).toBeGreaterThan(0);
  });
});
