import axios from 'axios';
import { authAsCredentialsState, LOCALSTORAGE_AUTH_KEY } from '@/libs/auth';

function saveLocalDataAuth (store, apiId, apiToken) {
  const credentialsObj = {
    auth: {
      apiId,
      apiToken,
    },
  };

  const userLocalData = JSON.stringify(credentialsObj);

  localStorage.setItem(LOCALSTORAGE_AUTH_KEY, userLocalData);

  store.state.credentials = authAsCredentialsState(credentialsObj);
}

export async function register (store, params) {
  let url = '/api/v4/user/auth/local/register';

  if (params.groupInvite) url += `?groupInvite=${params.groupInvite}`;

  const result = await axios.post(url, {
    username: params.username,
    email: params.email,
    password: params.password,
    confirmPassword: params.passwordConfirm,
  });

  const user = result.data.data;

  saveLocalDataAuth(store, user.id, user.apiToken);
}

export async function login (store, params) {
  const url = '/api/v4/user/auth/local/login';
  const result = await axios.post(url, {
    username: params.username,
    // email: params.email,
    password: params.password,
  });

  const user = result.data.data;

  saveLocalDataAuth(store, user.id, user.apiToken);
}

export async function verifyUsername (store, params) {
  const url = '/api/v4/user/auth/verify-username';
  const result = await axios.post(url, {
    username: params.username,
  });

  return result.data.data;
}

export async function verifyDisplayName (store, params) {
  const url = '/api/v4/user/auth/verify-display-name';
  const result = await axios.post(url, {
    displayName: params.displayName,
  });

  return result.data.data;
}

export async function socialAuth (store, params) {
  const url = '/api/v4/user/auth/social';
  const result = await axios.post(url, {
    network: params.auth.network,
    authResponse: params.auth.authResponse,
  });

  const user = result.data.data;

  saveLocalDataAuth(store, user.id, user.apiToken);
}

export async function appleAuth (store, params) {
  const url = '/api/v4/user/auth/apple';
  const result = await axios.get(url, {
    params: {
      code: params.code,
      name: params.name,
    },
  });

  const user = result.data.data;

  saveLocalDataAuth(store, user.id, user.apiToken);
}

export function logout (store, options = {}) {
  localStorage.clear();
  const query = options.redirectToLogin === true ? '?redirectToLogin=true' : '';
  window.location.href = `/logout-server${query}`;
}

export function setNewToken (store, params) {
  saveLocalDataAuth(store, params.userId, params.apiToken);
}
