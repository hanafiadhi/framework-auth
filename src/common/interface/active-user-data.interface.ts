export interface ActiveUserData {
  /**
   * The "Subject" of the token, The Value of thid property is the userID
   * that granted this token
   */
  sub: '1234';
  /**
   * The "Email" of the token, The Value of thid property is the Email User or something
   * that granted this token
   */
  email?: 'hanafi@gmail.com';

  /**
   * The "iat" of the token, The Value when token is created
   * that granted this token
   */
  iat: 1708951883;
  /**
   * The "exp" of the token, The Value describe when token is expired
   * that granted this token
   */
  exp: 1708955483;
  aud?: 'localhost:3000';
  iss?: 'localhost:3000';
}
