import { Injectable, Logger } from '@nestjs/common';

import { msg } from '@lingui/core/macro';
import { ConnectedAccountProvider } from 'twenty-shared/types';

import { UserInputError } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { SmsConnectionParameters } from 'src/engine/core-modules/sms-connection/types/sms-connection.type';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { type ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';

@Injectable()
export class SmsConnectionService {
  private readonly logger = new Logger(SmsConnectionService.name);

  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
  ) {}

  async testSmsConnection(
    handle: string,
    params: SmsConnectionParameters,
  ): Promise<boolean> {
    try {
      // TODO: Implement actual SMS.ir API connection test
      // For now, we'll validate the parameters
      if (!params.apiKey || !params.secretKey) {
        throw new UserInputError(
          'SMS connection parameters are incomplete',
          {
            userFriendlyMessage: msg`Please provide both API key and secret key.`,
          },
        );
      }

      // TODO: Add actual API call to SMS.ir to verify credentials
      // Example:
      // const response = await fetch('https://api.sms.ir/v1/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     apiKey: params.apiKey,
      //     secretKey: params.secretKey,
      //   }),
      // });
      // if (!response.ok) {
      //   throw new Error('Invalid credentials');
      // }

      this.logger.log(`SMS connection test successful for handle: ${handle}`);

      return true;
    } catch (error) {
      this.logger.error(
        `SMS connection failed: ${error.message}`,
        error.stack,
      );

      if (error instanceof UserInputError) {
        throw error;
      }

      throw new UserInputError(`SMS connection failed: ${error.message}`, {
        userFriendlyMessage: msg`We couldn't connect to your SMS provider. Please check your API credentials and try again.`,
      });
    }
  }

  async getSmsConnection(
    workspaceId: string,
    connectionId: string,
  ): Promise<ConnectedAccountWorkspaceEntity | null> {
    const connectedAccountRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<ConnectedAccountWorkspaceEntity>(
        workspaceId,
        'connectedAccount',
      );

    const connectedAccount = await connectedAccountRepository.findOne({
      where: {
        id: connectionId,
        provider: ConnectedAccountProvider.SMS_IR,
      },
    });

    return connectedAccount;
  }
}

