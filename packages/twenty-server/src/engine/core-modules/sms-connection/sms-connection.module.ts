import { Module } from '@nestjs/common';

import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';
import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { ConnectedAccountModule } from 'src/modules/connected-account/connected-account.module';

import { SmsConnectionValidatorModule } from './services/sms-connection-validator.module';
import { SmsConnectionService } from './services/sms-connection.service';
import { SmsConnectionResolver } from './sms-connection.resolver';

@Module({
  imports: [
    ConnectedAccountModule,
    MessageQueueModule,
    TwentyORMModule,
    SmsConnectionValidatorModule,
    PermissionsModule,
  ],
  providers: [SmsConnectionResolver, SmsConnectionService],
  exports: [SmsConnectionService],
})
export class SmsConnectionModule {}

