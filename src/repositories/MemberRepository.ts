import { EntityRepository, getConnection, Repository } from 'typeorm';
import { AuthToken } from '../entities/AuthToken';
import { Member } from '../entities/Member';

@EntityRepository(Member)
export class MemberRepository extends Repository<Member>
{
    async validateToken(userId: string, authToken: string, ip: string) {
        const queryRunner = await this.getQueryRunner();

        const user = await queryRunner.manager.findOne(Member, { id: userId });
        const token = await user.authTokens.find(x => x.id == authToken);

        return token.ip === ip;
    }


    async createAuthToken(userId: string) {
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
    }

    private async getQueryRunner() {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();

        return queryRunner;
    }
}
