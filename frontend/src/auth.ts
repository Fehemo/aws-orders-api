import { UserManager } from 'oidc-client-ts';

export const userManager = new UserManager({
  authority:
  'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_Q5I5LsxZ0',

  client_id: '1ln17fsno6g7mb1irkomsb53im',

  redirect_uri:
  'http://localhost:5173',

  response_type: 'code',

  scope: 'openid email',

  post_logout_redirect_uri:
  'http://localhost:5173',
});