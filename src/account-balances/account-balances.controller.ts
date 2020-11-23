import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountBalancesService } from './account-balances.service';
import { AccountBalance } from './account-balances.schema';
import { AccountBalanceDto, IAccountBalanceFilter } from './account-balances.dtos';

@ApiTags('account-balances')
@Controller('account-balances')
export class AccountBalancesController {
  constructor(private readonly accountBalancesService: AccountBalancesService) {}

  @Get('')
  @ApiOperation({ summary: 'Get account balances from one user' })
  @ApiQuery({ name: 'userId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Get all balances from one user',
    type: [AccountBalance],
  })
  async find(@Query() query: IAccountBalanceFilter): Promise<AccountBalanceDto[]> {
    return await this.accountBalancesService.getAllByUserId(query.userId) as AccountBalanceDto[];
  }
}
