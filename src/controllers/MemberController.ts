import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Member } from '../entities/Member';

export async function postLogin(request: Request, response: Response) {
    try {
        const memberRepository = getManager().getRepository(Member);
        const member = await memberRepository.findOne(request.params.id);

    } catch (err) {
        response.status(500);
    }

}
