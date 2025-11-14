import { Module } from '@nestjs/common';

import { UserVarsModule } from 'src/engine/core-modules/user/user-vars/user-vars.module';
import { DeleteWorkspaceMemberConnectedAccountsCleanupJob } from 'src/modules/connected-account/jobs/delete-workspace-member-connected-accounts.job';
import { ConnectedAccountWorkspaceMemberListener } from 'src/modules/connected-account/listeners/connected-account-workspace-member.listener';
import { ConnectedAccountListener } from 'src/modules/connected-account/listeners/connected-account.listener';
import { AccountsToReconnectService } from 'src/modules/connected-account/services/accounts-to-reconnect.service';
import { SmsAPIService } from 'src/modules/connected-account/services/sms-apis.service';

@Module({
  imports: [UserVarsModule],
  providers: [
    AccountsToReconnectService,
    ConnectedAccountListener,
    DeleteWorkspaceMemberConnectedAccountsCleanupJob,
    ConnectedAccountWorkspaceMemberListener,
    SmsAPIService,
  ],
  exports: [AccountsToReconnectService, SmsAPIService],
})
export class ConnectedAccountModule {}
