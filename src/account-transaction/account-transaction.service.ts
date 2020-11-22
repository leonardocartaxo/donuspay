import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AccountTransaction,
  AccountTransactionDocument,
  AccountTransactionType,
  Tax,
  TaxType,
} from './account-transaction.schema';
import {
  AccountDepositTransactionDto,
  AccountTransactionDto,
  AccountTransferTransactionDto,
} from './account-transaction.dtos';
import { UsersService } from '../users/users.service';
import { AccountBalancesService } from '../account-balances/account-balances.service';
import { User } from '../users/user.schema';

@Injectable()
export class AccountTransactionService {
  constructor(
    @InjectModel(AccountTransaction.name) private accountTransactionModel: Model<AccountTransactionDocument>,
    private usersService: UsersService,
    private accountBalancesService: AccountBalancesService
  ) {}

  async transfer(createAccountTransactionDto: AccountTransferTransactionDto): Promise<AccountTransactionDto> {
    return await this.handleTransfer({
      toUser: Types.ObjectId(createAccountTransactionDto.toUserId),
      fromUser: createAccountTransactionDto.fromUserId
        ? Types.ObjectId(createAccountTransactionDto.fromUserId)
        : null,
      value: createAccountTransactionDto.value,
      transactionType: AccountTransactionType.transfer
    });
  }

  async deposit(createAccountTransactionDto: AccountDepositTransactionDto): Promise<AccountTransactionDto> {
    return await this.handleDeposit({
      toUser: Types.ObjectId(createAccountTransactionDto.userId),
      value: createAccountTransactionDto.value,
      transactionType: AccountTransactionType.deposit
    });
  }

  async withdraw(createAccountTransactionDto: AccountDepositTransactionDto): Promise<AccountTransactionDto> {
    return await this.handleWithdraw({
      fromUser: Types.ObjectId(createAccountTransactionDto.userId),
      value: createAccountTransactionDto.value,
      transactionType: AccountTransactionType.withdraw
    });
  }

  async findById(id: string): Promise<AccountTransaction> {
    return this.accountTransactionModel.findById(id);
  };

  private getNewAccountTransactionModel(accountTransaction: AccountTransaction){
    return new this.accountTransactionModel(accountTransaction);
  };

  private async handleTransfer(accountTransaction: AccountTransaction): Promise<AccountTransactionDto> {
    const accountTransactionModel = new this.accountTransactionModel(accountTransaction);
    const createdAccountTransaction = await accountTransactionModel.save();

    let senderLastAccountBalance = await this.getSenderLastAccountBalance(accountTransaction);
    let receiverLastAccountBalance = await this.getReceiverLastAccountBalance(accountTransaction);

    AccountTransactionService.verifyBalance(senderLastAccountBalance?.balance, accountTransaction.value);

    await this.addAccountBalance(
      accountTransaction,
      accountTransaction.fromUser,
      senderLastAccountBalance?.balance ?? 0,
      -accountTransaction.value);

    await this.addAccountBalance(
      accountTransaction,
      accountTransaction.toUser,
      receiverLastAccountBalance?.balance ?? 0,
      accountTransaction.value);

    return createdAccountTransaction as AccountTransactionDto;
  }

  private async handleDeposit(accountTransaction: AccountTransaction): Promise<AccountTransactionDto> {
    accountTransaction.fromUser = null;
    const user = accountTransaction.toUser;
    const tax: Tax ={
      taxType: TaxType.deposit,
      value: accountTransaction.value * 0.005
    }
    accountTransaction.taxes = [tax];

    const createdAccountTransaction = await this.getNewAccountTransactionModel(accountTransaction).save();

    const receiverLastAccountBalance = await this.getReceiverLastAccountBalance(accountTransaction);

    await this.addAccountBalance(
      accountTransaction,
      user,
      receiverLastAccountBalance?.balance ?? 0,
      accountTransaction.value + tax.value
    );

    return createdAccountTransaction as AccountTransactionDto;
  }

  private async handleWithdraw(accountTransaction: AccountTransaction): Promise<AccountTransactionDto> {
    accountTransaction.toUser = null;
    const user = accountTransaction.fromUser;
    const tax: Tax ={
      taxType: TaxType.withdraw,
      value: accountTransaction.value * 0.01
    }
    accountTransaction.taxes = [tax];

    let lastAccountBalance = await this.getLastAccountBalance(accountTransaction.fromUser as Types.ObjectId);

    AccountTransactionService.verifyBalance(lastAccountBalance?.balance, accountTransaction.value + tax.value);

    const accountTransactionModel = new this.accountTransactionModel(accountTransaction);
    const createdAccountTransaction = await accountTransactionModel.save();

    await this.addAccountBalance(
      accountTransaction,
      user,
      lastAccountBalance?.balance ?? 0,
      -(accountTransaction.value + tax.value)
    );

    return createdAccountTransaction as AccountTransactionDto;
  }

  private static verifyBalance(balance: number, value: number) {
    if (balance < value){
      throw Error('insufficient balance')
    }
  }

  private async addAccountBalance(
    accountTransaction: AccountTransaction,
    user: User | Types.ObjectId,
    lastBalance: number,
    value: number
  ) {
    return await this.accountBalancesService.create({
      user: user,
      accountTransaction: accountTransaction,
      balance: lastBalance + value
    });
  }

  private async getLastAccountBalance(user: Types.ObjectId) {
    return await this.accountBalancesService.getLastByObjectId(user);
  }

  private async getSenderLastAccountBalance(accountTransaction: AccountTransaction) {
    return await this.getLastAccountBalance(accountTransaction.fromUser as Types.ObjectId);
  }

  private async getReceiverLastAccountBalance(accountTransaction: AccountTransaction) {
    return await this.getLastAccountBalance(accountTransaction.toUser as Types.ObjectId);
  }

}
