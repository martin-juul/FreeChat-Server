import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRoleToMemberTable1528826922462 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "member_role_enum" AS ENUM('ADMIN', 'MODERATOR', 'MEMBER', '0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "member" ADD "role" "member_role_enum" NOT NULL DEFAULT 'MEMBER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "member_role_enum"`);
    }

}
