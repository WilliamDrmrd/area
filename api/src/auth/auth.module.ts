import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategy';
import { EmailJsModule } from '../email-js/email-js.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    EmailJsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
