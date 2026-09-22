import { userManager } from './auth';

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const user = await userManager.getUser();

  const headers = new Headers(init.headers);

  if (user?.access_token) {
    headers.set('Authorization', `Bearer ${user.access_token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}