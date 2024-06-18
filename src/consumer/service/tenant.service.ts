import { Inject, Injectable } from '@nestjs/common';

import { TENANT_SERVICE } from 'src/common/constants/service-rmq.constant';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TenantClientService } from '../use-case/tenant.use-case';
import { FindTenantByTenantId } from '../../common/message-pattern/tenant-client.pattern';

@Injectable()
export class TenantService implements TenantClientService {
  constructor(
    @Inject(TENANT_SERVICE) private readonly tenantClient: ClientProxy,
  ) {}
  async findTenant(tenant: string): Promise<any> {
    return await firstValueFrom(
      this.tenantClient.send(FindTenantByTenantId, tenant),
    );
  }
}
