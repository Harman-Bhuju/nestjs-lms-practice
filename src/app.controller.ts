import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { MyLoggerService } from './logger/logger.service';
import debug from 'debug';

// do this $env:DEBUG="api:*"
const verbose = debug("api:verbose:AppController")
const error = debug("api:error:AppController")

@Controller()
export class AppController {
  
  //built-in logger
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    // we built this custom logger
    // private readonly logger : MyLoggerService
  ) {}

  @ApiOperation({summary: 'Health Check'})
  @ApiOkResponse({description : 'Returns the health check'})
  @Get('health')
  getHealth(){
    const tag = "getHealth -> AppController"
    verbose(`${tag} controller method: %j`, 'healthCheck')
    this.logger.log('Doing HealthCheck...')
    return this.appService.getHealth();
  }
}
