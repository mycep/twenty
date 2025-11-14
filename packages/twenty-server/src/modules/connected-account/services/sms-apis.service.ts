import { Injectable } from '@nestjs/common';

import { ConnectedAccountProvider } from 'twenty-shared/types';
import { v4 } from 'uuid';

import { type SmsConnectionParameters } from 'src/engine/core-modules/sms-connection/types/sms-connection.type';
import { type WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { type ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';

@Injectable()
export class SmsAPIService {
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
  ) {}

  async processAccount(input: {
    handle: string;
    workspaceMemberId: string;
    workspaceId: string;
    connectionParameters: SmsConnectionParameters;
    connectedAccountId?: string;
  }): Promise<string> {
    const { handle, workspaceId, workspaceMemberId, connectedAccountId } =
      input;

    const connectedAccountRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<ConnectedAccountWorkspaceEntity>(
        workspaceId,
        'connectedAccount',
      );

    const existingAccount = connectedAccountId
      ? await connectedAccountRepository.findOne({
          where: { id: connectedAccountId },
        })
      : await connectedAccountRepository.findOne({
          where: {
            handle,
            accountOwnerId: workspaceMemberId,
            provider: ConnectedAccountProvider.SMS_IR,
          },
        });

    const accountId = existingAccount?.id ?? connectedAccountId ?? v4();

    const workspaceDataSource =
      await this.twentyORMGlobalManager.getDataSourceForWorkspace({
        workspaceId,
      });

    await workspaceDataSource.transaction(async () => {
      await this.upsertConnectedAccount(
        input,
        accountId,
        connectedAccountRepository,
      );
    });

    return accountId;
  }

  private async upsertConnectedAccount(
    input: {
      handle: string;
      workspaceMemberId: string;
      connectionParameters: SmsConnectionParameters;
    },
    accountId: string,
    connectedAccountRepository: WorkspaceRepository<ConnectedAccountWorkspaceEntity>,
  ): Promise<void> {
    const accountData = {
      id: accountId,
      handle: input.handle,
      provider: ConnectedAccountProvider.SMS_IR,
      connectionParameters: input.connectionParameters as unknown as Record<
        string,
        unknown
      >,
      accountOwnerId: input.workspaceMemberId,
    };

    await connectedAccountRepository.save(accountData, {});
  }
}

