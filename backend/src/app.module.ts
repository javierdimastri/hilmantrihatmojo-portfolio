import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExcelModule } from './excel/excel.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [ExcelModule, PdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
