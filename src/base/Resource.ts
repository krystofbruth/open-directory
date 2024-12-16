import { Collection, ObjectId } from "mongodb";

export abstract class Resource {
  public abstract id: ObjectId | null;
  protected abstract collection: Collection;

  /** Creates the document in case it isn't associated with any. Throws in case of an error. */
  public abstract create(): Promise<void>;

  /** Updates the document with the current values. Throws in case of an error */
  public abstract update(): Promise<void>;

  /** Deletes the current document. Throws in case of an error. */
  public abstract delete(): Promise<void>;

  /** Fetch the resource from the DB. Shall be called during in the constructor. */
  public abstract fetch(id: string): Promise<void>;
}
