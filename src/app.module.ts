import { Module, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { CreativeService } from './creative/creative.service';
import { UtilsModule } from './utils/utils.module';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    UtilsModule,
    ModelsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CreativeService
  ],
})
export class AppModule implements OnModuleDestroy, OnApplicationShutdown {
  onModuleDestroy() {
    console.log('Module is being destroyed');
  }
  onApplicationShutdown() {
    console.log(`Application is shutting down`);
  }
}
