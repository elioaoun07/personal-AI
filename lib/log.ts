/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */

export function log(...args: any[]) {
  if (__DEV__) {
    console.log('[TasksApp]', ...args);
  }
}

export function logError(...args: any[]) {
  if (__DEV__) {
    console.error('[TasksApp Error]', ...args);
  }
}
