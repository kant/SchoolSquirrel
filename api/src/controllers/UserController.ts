import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import Avatars from "@dicebear/avatars";
import initialsSprites from "@dicebear/avatars-initials-sprites";
import { User } from "../entity/User";
import { Grade } from "../entity/Grade";

const avatars = new Avatars(initialsSprites, {});

class UserController {
    public static async listAll(req: Request, res: Response): Promise<void> {
        const userRepository = getRepository(User);
        const users = await userRepository.find({ relations: ["grade"] });
        res.send(users);
    }

    public static async avatar(req: Request, res: Response): Promise<void> {
        const userRepository = getRepository(User);
        const id = parseInt(req.params.id, 10);
        if (id === Number.NaN) {
            res.status(404).send({ message: "Benutzer nicht gefunden!" });
            return;
        }
        const user = await userRepository.findOne(id);
        if (req.params.ext == "svg") {
            res.contentType("svg");
            res.send(avatars.create(user.name));
        } else {
            const parts = user.name.split(" ");
            res.redirect(`https://eu.ui-avatars.com/api/?name=${parts[0][0]}+${parts[parts.length - 1][0]}&size=512`);
        }
    }

    public static async newUser(req: Request, res: Response): Promise<void> {
        const { name, role, grade } = req.body;
        if (!(name && ["student", "teacher", "admin"].includes(role) && grade)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const user = new User();
        user.name = name;
        user.password = req.app.locals.config.DEFAULT_PASSWORD;
        user.role = role;

        const userRepository = getRepository(User);
        const gradeRepository = getRepository(Grade);
        user.grade = await gradeRepository.findOne(grade);

        user.hashPassword();

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingUsername") });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static async editUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const { name, role, grade } = req.body;

        const userRepository = getRepository(User);
        const gradeRepository = getRepository(Grade);
        let user;
        try {
            user = await userRepository.findOne(id);
        } catch (error) {
            res.status(404).send({ message: i18n.__("errors.userNotFound") });
            return;
        }

        if (!(name && role && grade)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        user.name = name;
        user.role = role;
        user.grade = await gradeRepository.findOne(grade);

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingUsername") });
            return;
        }

        res.status(200).send({ success: true });
    }

    public static async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const userRepository = getRepository(User);
        try {
            await userRepository.delete(id);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingUser") });
            return;
        }

        res.status(200).send({ success: true });
    }
}

export default UserController;
