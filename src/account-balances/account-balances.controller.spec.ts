import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesController } from './account-balances.controller';

describe('AccountBalancesController', () => {
  let controller: AccountBalancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountBalancesController],
    }).compile();

    controller = module.get<AccountBalancesController>(AccountBalancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
