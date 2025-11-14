import gql from 'graphql-tag';

export const GET_CONNECTED_SMS_ACCOUNT = gql`
  query GetConnectedSmsAccount($id: UUID!) {
    getConnectedSmsAccount(id: $id) {
      id
      handle
      provider
      accountOwnerId
      connectionParameters {
        apiKey
        secretKey
        lineNumber
      }
    }
  }
`;

