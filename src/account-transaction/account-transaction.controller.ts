import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountTransactionService } from './account-transaction.service';
import {
  AccountDepositTransactionDto,
  AccountTransactionDto,
  AccountTransferTransactionDto,
  AccountWithDrawlTransactionDto,
} from './account-transaction.dtos';

@ApiTags('account transactions')
@Controller('account-transactions')
export class AccountTransactionController {
  constructor(
    private readonly accountTransactionsService: AccountTransactionService
  ) {}

  @Post('/transfer')
  @ApiOperation({ summary: 'Transfer money between users' })
  @ApiResponse({ status: 200, type: AccountTransactionDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async transfer(
    @Body() createAccountTransactionDto: AccountTransferTransactionDto
  ): Promise<AccountTransactionDto> {
    return await this.accountTransactionsService.transfer(createAccountTransactionDto) as AccountTransactionDto;
  }

  @Post('/deposit')
  @ApiOperation({ summary: 'Deposit money to one user' })
  @ApiResponse({ status: 200, type: AccountDepositTransactionDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deposit(
    @Body() createAccountTransactionDto: AccountDepositTransactionDto
  ): Promise<AccountTransactionDto> {
    return await this.accountTransactionsService.deposit(createAccountTransactionDto)
  }

  @Post('/withdraw')
  @ApiOperation({ summary: 'Withdraw money to one user' })
  @ApiResponse({ status: 200, type: AccountWithDrawlTransactionDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async withdraw(
    @Body() createAccountTransactionDto: AccountWithDrawlTransactionDto
  ): Promise<AccountTransactionDto> {
    return await this.accountTransactionsService.withdraw(createAccountTransactionDto) as AccountTransactionDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one accountTransaction by id' })
  @ApiResponse({
    status: 200,
    description: 'find accountTransaction by Id',
    type: AccountTransactionDto,
  })
  async findOne(@Param('id') id: string): Promise<AccountTransactionDto> {
    return await this.accountTransactionsService.findById(id) as AccountTransactionDto;
  }
}
