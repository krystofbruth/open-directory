export enum AuthorizationGrantType {
  user,
  app,
}

export type Permission = {
  delegatable: boolean;
};

export enum Permissions {
  "users.read" = "users.read",
  "users.self.read" = "users.self.read",
  "global" = "global",
  "users.create" = "users.create",
  "users.update" = "users.update",
  "users.delete" = "users.delete",
}

export const permissions: { [K in keyof typeof Permissions]?: Permission } = {
  "users.read": {
    delegatable: true,
  },
  "users.self.read": {
    delegatable: false,
  },
  "users.create": {
    delegatable: true,
  },
  "users.update": {
    delegatable: true,
  },
  "users.delete": {
    delegatable: false,
  },
  global: {
    delegatable: false,
  },
};

export const baseUserPermissions: Array<Permissions> = [
  Permissions["users.self.read"],
];

export class Authorization {
  constructor(
    public readonly type: AuthorizationGrantType,
    private permissions: Array<Permissions>,
    public readonly identifier: string
  ) {
    if (type === AuthorizationGrantType.user) {
      this.permissions = permissions.concat(baseUserPermissions);
    }
  }

  public checkPermission(permission: string): boolean {
    if (this.permissions.includes(Permissions.global)) return true;
    return this.permissions.includes(permission as Permissions);
  }
}
