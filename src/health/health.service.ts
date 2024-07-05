import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthCheckError,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import {
  RmqOptions,
  Transport,
  ClientProxyFactory,
  ClientProxy,
} from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@nestjs/config';
import { RmqService } from '../providers/queue/rabbbitmq/rmq.service';

@Injectable()
export class RmqHealthIndicator extends MicroserviceHealthIndicator {
  constructor(
    private readonly rmqService: RmqService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async isHealthQueue(key: string): Promise<HealthIndicatorResult> {
    const options: RmqOptions = this.rmqService.getOptions(key);

    try {
      const a = await this.pingCheck<RmqOptions>(key.toLocaleLowerCase(), {
        transport: Transport.RMQ,
        options: {
          urls: options.options.urls,
          queue: options.options.queue,
          queueOptions: {
            durable: true,
          },
          noAck: true,
          persistent: false,
          prefetchCount: 1,
        },
      });

      return this.getStatus(key.toLocaleLowerCase(), true);
    } catch (error) {
      const result = this.getStatus(key.toLocaleLowerCase(), false, {
        message: error.message,
      });
      throw new HealthCheckError('RabbitMQ check failed', result);
    }
  }

  async isHealthConsumer(key: string): Promise<HealthIndicatorResult> {
    const payload = { message: 'health check' };

    try {
      const client: ClientProxy = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this.configService.get<string>('transport.rabbitmq.uri')],
          queue: this.configService.get<string>(`RABBIT_MQ_${key}_QUEUE`),
          queueOptions: {
            durable: true,
          },
        },
      });

      await client.connect();

      await firstValueFrom(client.send('health-check', payload));

      await client.close(); // Ensure the client is properly closed

      return this.getStatus(key.toLocaleLowerCase(), true);
    } catch (error) {
      const result = this.getStatus(key.toLocaleLowerCase(), false, {
        message: error.message,
      });
      throw new HealthCheckError('RabbitMQ consumer check failed', result);
    }
  }
}
