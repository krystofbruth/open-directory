import createHttpError from "http-errors";
import { Resource } from "../base/Resource.js";
import Joi from "joi";
const schema = Joi.object({
  name: Joi.string().alphanum().min(1).required(),
  responseUris: Joi.array().items(Joi.string().uri()).required(),
});

export class App extends Resource {
  public id: string | null;
  public name: string | null;
  public responseUris: Array<string> | null;

  constructor(document: any | null) {
    super();
    this.id = null;

    if (document === null) {
      this.name = null;
      this.responseUris = null;
      return;
    }

    const validation = schema.validate(document);
    if (validation.error !== undefined) {
      throw createHttpError(400, validation.error.message);
    }

    this.name = document.name;
    this.responseUris = document.name;
  }

  public override async fetch(id: string) {
    // TBD fetch from DB
  }

  public override async create() {
    // TBD Save the resource in the DB
  }

  public override async update() {
    // TBD Update the resource with current values
  }

  public override async delete() {
    // TBD Delete the resource from the DB
  }
}
