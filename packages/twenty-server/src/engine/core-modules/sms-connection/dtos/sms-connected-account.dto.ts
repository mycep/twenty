import { Field, ObjectType } from '@nestjs/graphql';
import { ConnectedAccountProvider } from 'twenty-shared/types';

import { SmsConnectionParametersOutputDTO } from './sms-connection.dto';

@ObjectType('ConnectedSmsAccount')
export class ConnectedSmsAccountDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  handle: string;

  @Field(() => String)
  provider: ConnectedAccountProvider;

  @Field(() => SmsConnectionParametersOutputDTO, { nullable: true })
  connectionParameters?: SmsConnectionParametersOutputDTO;

  @Field(() => String)
  accountOwnerId: string;
}

