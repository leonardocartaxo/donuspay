import { Test, TestingModule } from '@nestjs/testing';
import { AccountTransactionService } from './account-transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountTransaction, AccountTransactionSchema } from './account-transaction.schema';
import { UsersModule } from '../users/users.module';
import { AccountBalancesModule } from '../account-balances/account-balances.module';

describe('AccountTransactionService', () => {
  let service: AccountTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost/nest',
          { useFindAndModify: false }
        ),
        MongooseModule.forFeature([{ name: AccountTransaction.name, schema: AccountTransactionSchema }]),
        UsersModule,
        AccountBalancesModule
      ],
      providers: [AccountTransactionService],
    }).compile();

    service = module.get<AccountTransactionService>(AccountTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
