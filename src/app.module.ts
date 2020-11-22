import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AccountTransactionModule } from './account-transaction/account-transaction.module';
import { AccountBalancesModule } from './account-balances/account-balances.module';

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/nest';

@Module({
  imports: [
      MongooseModule.forRoot(
        process.env.MONGO_URI,
        { useFindAndModify: false }
        ),
      UsersModule,
      AccountTransactionModule,
      AccountBalancesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
