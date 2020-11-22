import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesService } from './account-balances.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountBalance, AccountBalanceSchema } from './account-balances.schema';

describe('AccountBalancesService', () => {
  let service: AccountBalancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost/nest',
          { useFindAndModify: false }
        ),
        MongooseModule.forFeature([{ name: AccountBalance.name, schema: AccountBalanceSchema }])
      ],
      providers: [AccountBalancesService],
    }).compile();

    service = module.get<AccountBalancesService>(AccountBalancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('getAll', () => {
    expect(service).toBeDefined();
  });
});
