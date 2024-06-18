import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class TenantClientService {
  abstract findTenant(tenant: string): Promise<any>;
}
