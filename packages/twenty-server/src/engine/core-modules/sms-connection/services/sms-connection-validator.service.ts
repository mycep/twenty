import { Injectable } from '@nestjs/common';

import { SmsConnectionParameters } from '../types/sms-connection.type';

@Injectable()
export class SmsConnectionValidatorService {
  validateSmsConnectionParams(
    params: SmsConnectionParameters,
  ): SmsConnectionParameters {
    if (!params.apiKey || !params.apiKey.trim()) {
      throw new Error('API key is required');
    }

    if (!params.secretKey || !params.secretKey.trim()) {
      throw new Error('Secret key is required');
    }

    return {
      apiKey: params.apiKey.trim(),
      secretKey: params.secretKey.trim(),
      lineNumber: params.lineNumber?.trim(),
    };
  }
}

