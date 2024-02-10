/**
 * @interface JwtResponse
 * @description Interface for the JWT response token and user
 * @property {string} token - The access token for the user
 * @returns { token: string }
 * @example { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjI5MzIwMzIyLCJleHAiOjE2MjkzMjA0MjJ9.3Z'
 */
export interface JwtResponse {
  /**
   * @description The access token for the user
   * @type {string}
   * @memberof JwtResponse
   * @returns {string}
   */
  token: string;
}
