import type { UserAddressUpdateData } from '@marinetesio/types/dtos/user/api';

import {
  UserRepository,
  UserAddressRepository,
} from '@marinetesio/database/typeorm/mysql';
import { RegisterNotFoundError, BadRequestError } from '@marinetesio/errors';

export class UserAddressUpdateService implements Service {
  async execute(
    userId: string,
    addressId: string,
    data: UserAddressUpdateData,
  ): Promise<void> {
    const user = await UserRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .where({ id: userId })
      .select(['user.id', 'address.id'])
      .getOne();

    if (!user) {
      throw new RegisterNotFoundError();
    }

    const hasAddress = user.addresses.some(
      currentAddress => currentAddress.id === addressId,
    );

    if (!hasAddress) {
      throw new BadRequestError();
    }

    await UserAddressRepository.update(addressId, data);
  }
}