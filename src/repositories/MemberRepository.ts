import { EntityRepository, getConnection, Repository } from 'typeorm';
import { AuthToken } from '../entities/AuthToken';
import { Member } from '../entities/Member';
import { ITokenRequest } from '../model/requests/ITokenRequest';

@EntityRepository(Member)
export class MemberRepository extends Repository<Member>
{
    async validateToken(tokenRequest: ITokenRequest) {

        const user = await this.findOne( { id: tokenRequest.authToken });
        const token = await user.authTokens.find(x => x.id == tokenRequest.authToken);

        return token.ip === tokenRequest.ip;
    }

    async deleteToken(authToken: string): Promise<void> {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(AuthToken)
            .where("id = :id", {id: authToken})
            .execute();
    }


    async createAuthToken(userId: string): Promise<AuthToken> {
        const queryRunner = await this.getQueryRunner();

        const user = await queryRunner.manager.findOne(Member, { id: userId });
        const token = new AuthToken();

        token.member = user;
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(token);
            await queryRunner.commitTransaction();
        } catch (err) {
            console.log('[MemberRepository](createAuthToken)', err);
            await queryRunner.rollbackTransaction();
        }

        return await token;
    }

    private async getQueryRunner() {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        return queryRunner;
    }
}
