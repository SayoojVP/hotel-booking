import * as auth from '../../schema/auth.model';
import * as hotel from '../../schema/hotel.model';
import * as user from '../../schema/user.model';

export * from '../../schema/auth.model';
export * from '../../schema/hotel.model';
export * from '../../schema/user.model';

export const schema = {
    ...auth,
    ...hotel,
    ...user
};