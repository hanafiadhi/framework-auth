import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VOLUNTEER_SERVICE } from '@app/common';
import { VolunteerClientService } from '../use-case/volunteer.use-case';
import { firstValueFrom } from 'rxjs';
import { VolunteerMessagePattern } from '../../common/message-pattern/volunter-client';

@Injectable()
export class VolunterConsumer implements VolunteerClientService {
  constructor(
    @Inject(VOLUNTEER_SERVICE) private readonly volunteerClient: ClientProxy,
  ) {}
  async updateManyByFilter(payload: object): Promise<any> {
    return await firstValueFrom(
      this.volunteerClient.emit(VolunteerMessagePattern.UPDATEMANY, payload),
    );
  }

  async removeMany(payload: object): Promise<any> {
    return await firstValueFrom(
      this.volunteerClient.send(VolunteerMessagePattern.REMOVEMANY, payload),
    );
  }
  async findAll(query: any): Promise<any | Error> {
    return await firstValueFrom(
      this.volunteerClient.send(VolunteerMessagePattern.FINDALL, query),
    );
  }
  async findOne(_id: string): Promise<any | Error> {
    return await firstValueFrom(
      this.volunteerClient.send(VolunteerMessagePattern.FINDONE, { _id }),
    );
  }
  async update(_id: any, updateVolunteerDto: any): Promise<any | Error> {
    return await firstValueFrom(
      this.volunteerClient.send(VolunteerMessagePattern.UPDATE, {
        _id,
        updateVolunteerDto,
      }),
    );
  }
  async remove(_id: string): Promise<any> {
    return await firstValueFrom(
      this.volunteerClient.send(VolunteerMessagePattern.REMOVE, { _id }),
    );
  }

  async create(createVolunteerDto: any): Promise<any> {
    return await firstValueFrom(
      this.volunteerClient.send(
        VolunteerMessagePattern.CREATE,
        createVolunteerDto,
      ),
    );
  }
}
