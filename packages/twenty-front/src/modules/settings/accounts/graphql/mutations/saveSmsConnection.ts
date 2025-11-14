import gql from 'graphql-tag';

export const SAVE_SMS_ACCOUNT = gql`
  mutation SaveSmsAccount(
    $accountOwnerId: UUID!
    $handle: String!
    $connectionParameters: SmsConnectionParameters!
    $id: UUID
  ) {
    saveSmsAccount(
      accountOwnerId: $accountOwnerId
      handle: $handle
      connectionParameters: $connectionParameters
      id: $id
    ) {
      success
      connectedAccountId
    }
  }
`;

