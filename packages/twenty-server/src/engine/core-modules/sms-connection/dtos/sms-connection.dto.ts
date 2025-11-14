import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SmsConnectionParameters {
  @Field(() => String)
  apiKey: string;

  @Field(() => String)
  secretKey: string;

  @Field(() => String, { nullable: true })
  lineNumber?: string;
}

@ObjectType('SmsConnectionParametersOutput')
export class SmsConnectionParametersOutputDTO {
  @Field(() => String)
  apiKey: string;

  @Field(() => String)
  secretKey: string;

  @Field(() => String, { nullable: true })
  lineNumber?: string;
}

