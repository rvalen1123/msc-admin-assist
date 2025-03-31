import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from '../../modules/auth/decorators/roles.decorator';
import { UserRole } from '../../modules/users/enums/user-role.enum';
import { CacheService } from '../services/cache.service';

@ApiTags('Cache')
@Controller('cache')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Post('clear')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Clear all caches (Redis and memory)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Caches cleared successfully',
    schema: {
      properties: {
        redisCleared: { type: 'boolean' },
        memoryCleared: { type: 'boolean' }
      }
    }
  })
  async clearAllCaches() {
    return this.cacheService.clearAllCaches();
  }
} 