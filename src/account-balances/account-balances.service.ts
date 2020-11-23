import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AccountBalance, AccountBalanceDocument } from './account-balances.schema';

@Injectable()
export class AccountBalancesService {
  constructor(
    @InjectModel(AccountBalance.name) private balanceDocumentModel: Model<AccountBalanceDocument>
  ) {}

  async create(accountBalance: AccountBalance): Promise<AccountBalance> {
    const createAccountBalance = new this.balanceDocumentModel(accountBalance);
    return createAccountBalance.save();
  }

  async getAllByUserId(userId: string): Promise<AccountBalance[]> {
    return this.balanceDocumentModel.find(
      {
        user: Types.ObjectId(userId)
      })
      .sort({ created_at: 1 });
  }

  async getLastById(userId: string): Promise<AccountBalance> {
    return await this.getLastByObjectId(Types.ObjectId(userId));
  }

  async getLastByObjectId(userId: Types.ObjectId): Promise<AccountBalance> {
    return await this.balanceDocumentModel.findOne(
      {
        user: userId
      })
      .sort({created_at: 1}).exec();
  }
}
