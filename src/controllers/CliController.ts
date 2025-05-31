import { input, checkbox } from "@inquirer/prompts";
import { UserService } from "../services/UserService.js";
import { Permissions } from "../models/Authorization.js";

export class CliController {
  constructor(private userService: UserService) {}

  public async createUser() {
    const username = await input({
      message: "Enter a username: ",
      required: true,
    });
    const password = await input({
      message: "Enter a password: ",
      required: true,
    });

    const permissions = (await checkbox({
      message: "Select permissions",
      choices: [
        { name: "users.read", value: "users.read" },
        { name: "users.create", value: "users.create" },
        {
          name: "users.update",
          value: "users.update",
        },
        {
          name: "users.delete",
          value: "users.delete",
        },
        {
          name: "global (dangerous!)",
          value: "global",
        },
      ],
    })) as Permissions[];

    const user = await this.userService.createUser({
      username,
      password,
      permissions,
    });

    console.log(
      `--- User creation success ---\nUID: ${
        user.userid
      }\nUsername: ${username}\nPermissions: ${user.permissions.join(",")}`
    );
  }
}
