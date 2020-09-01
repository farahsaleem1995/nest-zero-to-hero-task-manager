import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoaclAuthGuard extends AuthGuard('local') {}
