import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  get connectionString(): string {
    return this.configService.get<string>('AZURE_SQL_CONNECTION_STRING');
  }

  get shadowConnectionString(): string {
    return this.configService.get<string>('AZURE_SQL_SHADOW_CONNECTION_STRING');
  }
}
