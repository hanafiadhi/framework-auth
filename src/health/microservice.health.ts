import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import {
  ClientProxyFactory,
  Transport,
  ClientOptions,
  TcpClientOptions,
  GrpcOptions,
} from '@nestjs/microservices';
import { TimeoutError } from 'rxjs';

@Injectable()
export class MicroserviceHealthIndicator extends HealthIndicator {
  constructor() {
    super();
    this.checkDependantPackages();
  }

  private checkDependantPackages() {
    if (!ClientProxyFactory || !Transport) {
      throw new InternalServerErrorException(
        'Missing NestJS microservice package',
      );
    }
  }

  private async pingMicroservice(options: ClientOptions, timeout: number) {
    const client = ClientProxyFactory.create(options);
    try {
      await client.connect();
      await client.close();
    } catch (err) {
      throw new TimeoutError();
    }
  }

  private generateError(key: string, error: Error, timeout: number) {
    const errorResult = this.getStatus(key, false, {
      message: error.message,
      timeout,
    });
    throw new HealthCheckError('Microservice check failed', errorResult);
  }

  async pingCheck<MicroserviceClientOptions extends ClientOptions>(
    key: string,
    options: MicroserviceClientOptions,
    timeout = 1000,
  ): Promise<HealthIndicatorResult> {
    try {
      await this.pingMicroservice(options, timeout);
    } catch (err) {
      this.generateError(key, err, timeout);
    }
    return this.getStatus(key, true);
  }
}
