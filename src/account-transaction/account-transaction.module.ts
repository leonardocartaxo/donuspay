import { Module } from '@nestjs/common';
import { AccountTransactionService } from './account-transaction.service';
import { AccountTransactionController } from './account-transaction.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountTransaction, AccountTransactionSchema } from './account-transaction.schema';
import { AccountBalancesModule } from '../account-balances/account-balances.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccountTransaction.name, schema: AccountTransactionSchema }]),
    UsersModule,
    AccountBalancesModule
  ],
  providers: [AccountTransactionService],
  controllers: [AccountTransactionController]
})
export class AccountTransactionModule {}
