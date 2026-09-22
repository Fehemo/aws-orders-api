import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { cognitoVerifier } from './cognito-verifier.js';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const token = authorization.substring('Bearer '.length);

    try {
      const payload = await cognitoVerifier.verify(token);

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }
}