import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountBalancesService } from './account-balances.service';
import { AccountBalance } from './account-balances.schema';
import { AccountBalanceDto, IAccountBalanceFilter } from './account-balances.dtos';

@ApiTags('account-balances')
@Controller('account-balances')
export class AccountBalancesController {
  constructor(private readonly accountBalancesService: AccountBalancesService) {}

  @Get('')
  @ApiQuery({name: 'userId', type: IAccountBalanceFilter})
  @ApiResponse({
    status: 200,
    description: 'find all by userId',
    type: [AccountBalance],
  })
  async find(@Query() query: IAccountBalanceFilter): Promise<AccountBalanceDto[]> {
    return await this.accountBalancesService.getAllByUserId(query.userId) as AccountBalanceDto[];
  }
}
