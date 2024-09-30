import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export const idValidator = (id: string) => {
    if (!id) throw new BadRequestException('Id is required');
    if (!Types.ObjectId.isValid(id))
        throw new BadRequestException('Id is not valid');
};
