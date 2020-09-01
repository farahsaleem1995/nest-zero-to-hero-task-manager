import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const requset = ctx.switchToHttp().getRequest();

    console.log('Before Request', {
      url: requset.url,
      method: requset.method,
      body: requset.body,
    });

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const res = ctx.switchToHttp().getResponse();

        console.log('After Request', {
          url: requset.url,
          method: requset.method,
        });

        console.log(`Take Time... ${Date.now() - now}ms`);

        console.log('Response', {
          statusCode: res.statusCode,
        });
      }),
    );
  }
}
