import { Module } from '@nestjs/common';
import { SpeakingWritingController } from './speaking-writing.controller';
import { SpeakingWritingService } from './speaking-writing.service';

@Module({
  controllers: [SpeakingWritingController],
  providers: [SpeakingWritingService],
  exports: [SpeakingWritingService],
})
export class SpeakingWritingModule {}
