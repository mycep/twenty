import { Module } from '@nestjs/common';

import { SmsConnectionValidatorService } from './sms-connection-validator.service';

@Module({
  providers: [SmsConnectionValidatorService],
  exports: [SmsConnectionValidatorService],
})
export class SmsConnectionValidatorModule {}

