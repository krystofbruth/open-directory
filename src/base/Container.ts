import { Db as MongoDB } from "mongodb";
import { UserRepository } from "../repositories/UserRepository.js";
import { DependencyException } from "./Exceptions.js";

interface Dependencies {
  mongod: MongoDB;
  userRepository: UserRepository;
}

type DependecyKey = keyof Dependencies;

export type DependencyFactory<T> = (container: Container) => Promise<T> | T;

export class Container {
  private dependencies: Partial<Dependencies>;

  constructor() {
    this.dependencies = {};
  }

  inject<K extends DependecyKey>(dependecyKey: K): Dependencies[K] {
    if (typeof this.dependencies[dependecyKey] === "undefined") {
      throw new DependencyException(dependecyKey);
    }
    return this.dependencies[dependecyKey];
  }

  async register<K extends DependecyKey>(
    dependecyKey: K,
    factory: DependencyFactory<Dependencies[K]>
  ) {
    this.dependencies[dependecyKey] = await factory(this);
    return this;
  }
}
