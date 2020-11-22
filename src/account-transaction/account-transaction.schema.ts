import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';

export enum AccountTransactionType {
  transfer = 'transfer',
  withdraw = 'withdraw',
  deposit = 'deposit'
}

export enum TaxType {
  withdraw = 'withdraw',
  deposit = 'deposit'
}

export interface Tax {
  taxType: TaxType,
  value: number
}

export type AccountTransactionDocument = AccountTransaction & Document;

@Schema({ timestamps: true })
export class AccountTransaction {
  @Prop({ required: true })
  value: number;
  @Prop({ type: Types.ObjectId, ref: User.name })
  fromUser?: User | Types.ObjectId
  @Prop({ type: Types.ObjectId, ref: User.name})
  toUser?: User | Types.ObjectId
  @Prop({ required: true })
  transactionType: AccountTransactionType
  @Prop()
  taxes?: Tax[]
}

export const AccountTransactionSchema = SchemaFactory.createForClass(AccountTransaction);
