import { Status, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  status: Status;
  id: string;
  @Exclude()
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
