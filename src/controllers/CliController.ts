import { input } from "@inquirer/prompts";
import { UserService } from "../services/UserService.js";

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

    const user = await this.userService.createUser(username, password);

    console.log(
      `--- User creation success ---\nUID: ${user.userid}\nUsername: ${username}`
    );
  }
}
