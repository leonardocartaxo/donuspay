import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';
import { AccountTransaction } from '../account-transaction/account-transaction.schema';

export type AccountBalanceDocument = AccountBalance & Document;

@Schema({timestamps: true })
export class AccountBalance {
  @Prop({ required: true })
  balance: number;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user?: User | Types.ObjectId
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  accountTransaction: AccountTransaction | Types.ObjectId
}

export const AccountBalanceSchema = SchemaFactory.createForClass(AccountBalance);
