import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

/**
 * UserService — Phase 0 skeleton
 * Full implementation in Phase 1
 */
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Phase 1: implement findById, findByEmail, updateProfile, etc.
}
