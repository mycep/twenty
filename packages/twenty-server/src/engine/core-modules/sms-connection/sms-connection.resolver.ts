import {
    UseFilters,
    UseGuards,
    UsePipes
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ConnectedAccountProvider } from 'twenty-shared/types';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { AuthGraphqlApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-graphql-api-exception.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { UserInputError } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { ConnectedSmsAccountDTO } from 'src/engine/core-modules/sms-connection/dtos/sms-connected-account.dto';
import { SmsConnectionSuccessDTO } from 'src/engine/core-modules/sms-connection/dtos/sms-connection-success.dto';
import { SmsConnectionParameters } from 'src/engine/core-modules/sms-connection/dtos/sms-connection.dto';
import { SmsConnectionValidatorService } from 'src/engine/core-modules/sms-connection/services/sms-connection-validator.service';
import { SmsConnectionService } from 'src/engine/core-modules/sms-connection/services/sms-connection.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { SettingsPermissionGuard } from 'src/engine/guards/settings-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { PermissionFlagType } from 'src/engine/metadata-modules/permissions/constants/permission-flag-type.constants';
import { PermissionsGraphqlApiExceptionFilter } from 'src/engine/metadata-modules/permissions/utils/permissions-graphql-api-exception.filter';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { SmsAPIService } from 'src/modules/connected-account/services/sms-apis.service';
import { type ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';

@Resolver()
@UsePipes(ResolverValidationPipe)
@UseFilters(AuthGraphqlApiExceptionFilter, PermissionsGraphqlApiExceptionFilter)
@UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
export class SmsConnectionResolver {
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly smsConnectionService: SmsConnectionService,
    private readonly smsConnectionValidatorService: SmsConnectionValidatorService,
    private readonly smsApisService: SmsAPIService,
  ) {}

  @Query(() => ConnectedSmsAccountDTO)
  @UseGuards(WorkspaceAuthGuard)
  async getConnectedSmsAccount(
    @Args('id', { type: () => UUIDScalarType }) id: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<ConnectedSmsAccountDTO> {
    const connectedAccountRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<ConnectedAccountWorkspaceEntity>(
        workspace.id,
        'connectedAccount',
      );

    const connectedAccount = await connectedAccountRepository.findOne({
      where: { id, provider: ConnectedAccountProvider.SMS_IR },
    });

    if (!connectedAccount) {
      throw new UserInputError(
        `Connected SMS account with ID ${id} not found`,
      );
    }

    return {
      id: connectedAccount.id,
      handle: connectedAccount.handle,
      provider: connectedAccount.provider,
      connectionParameters: connectedAccount.connectionParameters as {
        apiKey: string;
        secretKey: string;
        lineNumber?: string;
      },
      accountOwnerId: connectedAccount.accountOwnerId,
    };
  }

  @Mutation(() => SmsConnectionSuccessDTO)
  @UseGuards(WorkspaceAuthGuard)
  async saveSmsAccount(
    @Args('accountOwnerId', { type: () => UUIDScalarType })
    accountOwnerId: string,
    @Args('handle') handle: string,
    @Args('connectionParameters')
    connectionParameters: SmsConnectionParameters,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('id', { type: () => UUIDScalarType, nullable: true }) id?: string,
  ): Promise<SmsConnectionSuccessDTO> {
    const validatedParams =
      this.smsConnectionValidatorService.validateSmsConnectionParams(
        connectionParameters,
      );

    await this.smsConnectionService.testSmsConnection(handle, validatedParams);

    const connectedAccountId = await this.smsApisService.processAccount({
      handle,
      workspaceMemberId: accountOwnerId,
      workspaceId: workspace.id,
      connectionParameters: validatedParams,
      connectedAccountId: id,
    });

    return {
      success: true,
      connectedAccountId,
    };
  }
}

