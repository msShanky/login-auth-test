import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

const connectionString =
  'mongodb+srv://sampleAppUser:dbSecurePassword@cluster0.us2eg.mongodb.net?retryWrites=true&w=majority';

@Module({
  imports: [MongooseModule.forRoot(connectionString), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
