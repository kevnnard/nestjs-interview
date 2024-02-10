/**
 * @interface JwtPayload
 * @description Interface for the JWT payload
 * @property {number} id - The user id
 * @property {string} email - The email of the user
 * @returns { id: number , email: string }
 */
export interface JwtPayloadInterface {
  /**
   * @description The user id
   * @type {number}
   * @memberof JwtPayload
   * @returns {number}
   */
  id: number;

  /**
   * @description The email of the user
   * @type {string}
   * @memberof JwtPayload
   * @returns {string}
   */
  email: string;
}
