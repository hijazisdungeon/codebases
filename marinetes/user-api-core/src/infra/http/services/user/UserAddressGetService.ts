import type { UserAddressDocument } from '@marinetesio/types/dtos/user/api';

import { UserRepository } from '@marinetesio/database/typeorm/mysql';
import { RegisterNotFoundError, BadRequestError } from '@marinetesio/errors';
import { instanceToPlain } from 'class-transformer';

export class UserAddressGetService implements Service {
  async execute(
    userId: string,
    addressId: string,
  ): Promise<UserAddressDocument> {
    const user = await UserRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .where({ id: userId })
      .select([
        'user.id',
        'address.id',
        'address.title',
        'address.type',
        'address.category',
        'address.rooms',
        'address.square_meters',
        'address.zip_code',
        'address.state',
        'address.city',
        'address.neighborhood',
        'address.street',
        'address.number',
        'address.complement',
      ])
      .getOne();

    if (!user) {
      throw new RegisterNotFoundError();
    }

    const findedAddress = user.addresses.find(
      currentAddress => currentAddress.id === addressId,
    );

    if (!findedAddress) {
      throw new BadRequestError();
    }

    return instanceToPlain(findedAddress) as UserAddressDocument;
  }
}