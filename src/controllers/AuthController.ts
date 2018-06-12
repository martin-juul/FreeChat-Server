import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AuthToken } from '../entities/AuthToken';
import { ITokenRequest } from '../model/requests/ITokenRequest';
import { MemberRepository } from '../repositories/MemberRepository';

export namespace AuthController
{
    export async function postCreateToken(request: Request, response: Response) {
        try {
            const tokenRequest: ITokenRequest = <ITokenRequest>request.params;
            const memberRepository = getCustomRepository(MemberRepository);

            memberRepository.createAuthToken(tokenRequest.userId).then((token: AuthToken) => {
                response.json(token);
            }).catch((err) => {
                console.error(err);
                response.status(500);
            });

        } catch (err) {
            console.log(err);
            response.status(500);
        }
    }

    export async function postValidateToken(request: Request, response: Response) {
        try {
            const tokenRequest: ITokenRequest = <ITokenRequest>request.params;
            const memberRepository = getCustomRepository(MemberRepository);

            if (memberRepository.validateToken(tokenRequest)) {
                response.status(200);
            } else {
                response.status(401);
            }

        } catch (err) {
            console.log(err);
            response.status(500);
        }

    }

}
