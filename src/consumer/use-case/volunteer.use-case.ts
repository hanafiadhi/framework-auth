import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class VolunteerClientService {
  abstract findAll(query: any): Promise<any | Error>;

  abstract updateManyByFilter(payload: object): Promise<any | Error>;

  abstract findOne(_id: string): Promise<any | null | Error>;

  abstract update(_id: string, updateVolunteerDto: any): Promise<any | Error>;

  abstract remove(_id: string): Promise<any | Error>;

  abstract removeMany(payload: object): Promise<any | Error>;

  abstract create(createVolunteerDto: any): Promise<any>;
}
