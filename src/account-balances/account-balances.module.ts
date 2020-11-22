import { Module } from '@nestjs/common';
import { AccountBalancesService } from './account-balances.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountBalance, AccountBalanceSchema } from './account-balances.schema';
import { AccountBalancesController } from './account-balances.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccountBalance.name, schema: AccountBalanceSchema }])
  ],
  providers: [AccountBalancesService],
  exports: [AccountBalancesService],
  controllers: [AccountBalancesController],
})
export class AccountBalancesModule {}
