import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return{
      status: 'ok',
      message: 'Application is healthy',
      timestamp: new Date().toISOString(),
    }
  }
}
