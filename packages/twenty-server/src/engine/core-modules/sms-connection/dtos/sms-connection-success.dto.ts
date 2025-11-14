import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('SmsConnectionSuccess')
export class SmsConnectionSuccessDTO {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  connectedAccountId: string;
}

