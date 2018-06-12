import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPermissions1528828252112 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "chat_room_permission_role_enum" AS ENUM('MUTE', 'KICK', 'BAN', 'CHANGE_COLOR', '0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "chat_room_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "chat_room_permission_role_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "memberId" uuid, "chatRoomIdId" uuid, CONSTRAINT "PK_1d206f29cc7aaf727007001bf70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "member_role_enum" RENAME TO "member_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "member_role_enum" AS ENUM('ADMIN', 'MODERATOR', 'MEMBER', '0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" TYPE "member_role_enum" USING "role"::"text"::"member_role_enum"`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" SET DEFAULT 'MEMBER'`);
        await queryRunner.query(`DROP TYPE "member_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "chat_room_permission" ADD CONSTRAINT "FK_4f7b92182e77489988f74b7ee5e" FOREIGN KEY ("memberId") REFERENCES "member"("id")`);
        await queryRunner.query(`ALTER TABLE "chat_room_permission" ADD CONSTRAINT "FK_461372252485c6f6d6cedaa49e5" FOREIGN KEY ("chatRoomIdId") REFERENCES "chat_room"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "chat_room_permission" DROP CONSTRAINT "FK_461372252485c6f6d6cedaa49e5"`);
        await queryRunner.query(`ALTER TABLE "chat_room_permission" DROP CONSTRAINT "FK_4f7b92182e77489988f74b7ee5e"`);
        await queryRunner.query(`CREATE TYPE "member_role_enum_old" AS ENUM('ADMIN', 'MODERATOR', 'MEMBER', '0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" TYPE "member_role_enum_old" USING "role"::"text"::"member_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "role" SET DEFAULT 'MEMBER'`);
        await queryRunner.query(`DROP TYPE "member_role_enum"`);
        await queryRunner.query(`ALTER TYPE "member_role_enum_old" RENAME TO "member_role_enum"`);
        await queryRunner.query(`DROP TABLE "chat_room_permission"`);
        await queryRunner.query(`DROP TYPE "chat_room_permission_role_enum"`);
    }

}
