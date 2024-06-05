import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}
  startSession(uid: number, token: string) {
    this.sessionRepository.save({ uid: uid, token: token });
  }
  async getActiveSessions(uid: number): Promise<Session[]> {
    return this.sessionRepository.findBy({ id: uid });
  }
  async deleteSession(session: Session) {
    this.sessionRepository.delete(session);
  }
}
