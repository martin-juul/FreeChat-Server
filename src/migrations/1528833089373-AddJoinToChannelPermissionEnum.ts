import {MigrationInterface, QueryRunner} from "typeorm";

export class AddJoinToChannelPermissionEnum1528833089373 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "chat_room_permission_role_enum" RENAME TO "chat_room_permission_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "chat_room_permission_role_enum" AS ENUM('MUTE', 'KICK', 'BAN', 'CHANGE_COLOR', 'JOIN', '0', '1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "chat_room_permission" ALTER COLUMN "role" TYPE "chat_room_permission_role_enum" USING "role"::"text"::"chat_room_permission_role_enum"`);
        await queryRunner.query(`DROP TYPE "chat_room_permission_role_enum_old"`);
        await queryRunner.query(`ALTER TYPE "member_role_enum" RENAME TO "member_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "member_role_enum" AS ENUM('ADMIN', 'MODERATOR', 'MEMBER', '0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" TYPE "member_role_enum" USING "role"::"text"::"member_role_enum"`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" SET DEFAULT 'MEMBER'`);
        await queryRunner.query(`DROP TYPE "member_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "member_role_enum_old" AS ENUM('ADMIN', 'MODERATOR', 'MEMBER', '0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" TYPE "member_role_enum_old" USING "role"::"text"::"member_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" SET DEFAULT 'MEMBER'`);
        await queryRunner.query(`DROP TYPE "member_role_enum"`);
        await queryRunner.query(`ALTER TYPE "member_role_enum_old" RENAME TO "member_role_enum"`);
        await queryRunner.query(`CREATE TYPE "chat_room_permission_role_enum_old" AS ENUM('MUTE', 'KICK', 'BAN', 'CHANGE_COLOR', '0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "chat_room_permission" ALTER COLUMN "role" TYPE "chat_room_permission_role_enum_old" USING "role"::"text"::"chat_room_permission_role_enum_old"`);
        await queryRunner.query(`DROP TYPE "chat_room_permission_role_enum"`);
        await queryRunner.query(`ALTER TYPE "chat_room_permission_role_enum_old" RENAME TO "chat_room_permission_role_enum"`);
    }

}
