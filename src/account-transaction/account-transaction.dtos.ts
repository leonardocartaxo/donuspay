import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.schema';
import { Tax, AccountTransactionType } from './account-transaction.schema';

export class AccountTransactionDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty( )
  value: number;
  @ApiProperty()
  fromUser: User
  @ApiProperty()
  toUser: User
  @ApiProperty()
  transactionType: AccountTransactionType
  @ApiProperty()
  taxes: Tax[]
}

export class AccountTransactionCreateOrUpdateDto {
  @ApiProperty( )
  value: number;
  @ApiProperty({required: false})
  fromUserId?: string
  @ApiProperty()
  toUserId: string
  @ApiProperty()
  transactionType: AccountTransactionType
}

export class AccountDepositTransactionDto {
  @ApiProperty({ required: true })
  value: number;
  @ApiProperty({ required: true })
  userId?: string;
}

export class AccountWithDrawlTransactionDto {
  @ApiProperty({ required: true })
  value: number;
  @ApiProperty({ required: true })
  userId?: string;
}

export class AccountTransferTransactionDto {
  @ApiProperty( )
  value: number;
  @ApiProperty({required: false})
  fromUserId: string
  @ApiProperty()
  toUserId: string
}
