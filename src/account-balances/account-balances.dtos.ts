import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.schema';
import { AccountTransaction } from '../account-transaction/account-transaction.schema';

export class AccountBalanceDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly created_at: Date;
  @ApiProperty()
  readonly updated_at: Date;
  @ApiProperty()
  balance: number;
  @ApiProperty()
  user: User
  @ApiProperty()
  accountTransaction: AccountTransaction
}

export class IAccountBalanceFilter {
  userId: string
}
