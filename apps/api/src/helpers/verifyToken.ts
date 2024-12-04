import { jwtValidationResponse, validateToken } from '@kinde/jwt-validator';
import { jwtDecoder } from '@kinde/jwt-decoder';

export async function verifyToken(token: string) {
  const validationResult: jwtValidationResponse = await validateToken({
    token: token,
    domain: 'https://unboxingproject.kinde.com',
  });

  const decodedToken: {
    roles: [{ id: string; key: string; name: string }];
  } | null = jwtDecoder(token);

  const hasAdminAccess = decodedToken?.roles.find(
    (role) => role.key === 'admin-member'
  );

  if (hasAdminAccess && validationResult.valid) {
    return true;
  } else {
    return false;
  }
}
