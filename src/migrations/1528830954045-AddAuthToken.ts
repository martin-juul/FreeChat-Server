import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAuthToken1528830954045 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "auth_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ip" inet NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "memberId" uuid, CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "chat_room_permission_role_enum" RENAME TO "chat_room_permission_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "chat_room_permission_role_enum" AS ENUM('MUTE', 'KICK', 'BAN', 'CHANGE_COLOR', '0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "chat_room_permission" ALTER COLUMN "role" TYPE "chat_room_permission_role_enum" USING "role"::"text"::"chat_room_permission_role_enum"`);
        await queryRunner.query(`DROP TYPE "chat_room_permission_role_enum_old"`);
        await queryRunner.query(`ALTER TYPE "member_role_enum" RENAME TO "member_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "member_role_enum" AS ENUM('ADMIN', 'MODERATOR', 'MEMBER', '0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" TYPE "member_role_enum" USING "role"::"text"::"member_role_enum"`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" SET DEFAULT 'MEMBER'`);
        await queryRunner.query(`DROP TYPE "member_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "auth_token" ADD CONSTRAINT "FK_e845e694a133aebbd6b00e8f29f" FOREIGN KEY ("memberId") REFERENCES "member"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "auth_token" DROP CONSTRAINT "FK_e845e694a133aebbd6b00e8f29f"`);
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
        await queryRunner.query(`DROP TABLE "auth_token"`);
    }

}
