import { CognitoJwtVerifier } from 'aws-jwt-verify';

export const cognitoVerifier = CognitoJwtVerifier.create({
  userPoolId: 'us-east-2_Q5I5LsxZ0',
  tokenUse: 'access',
  clientId: '1ln17fsno6g7mb1irkomsb53im',
});