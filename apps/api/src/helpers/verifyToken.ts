import { jwtValidationResponse, validateToken } from '@kinde/jwt-validator';

export async function verifyToken(token: string) {
  const validationResult: jwtValidationResponse = await validateToken({
    token: token,
    domain: 'https://unboxingproject.kinde.com',
  });

  return validationResult.valid;
}
