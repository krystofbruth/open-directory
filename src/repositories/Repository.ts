export interface Repository<TModel, TModifiable, TFilter> {
  find(filter?: TFilter): Promise<TModel[]> | TModel[];
  insert(inp: TModifiable): Promise<TModel> | TModel;
  update(filter: TFilter, inp: TModifiable): Promise<TModel> | TModel;
  delete(filter: TFilter): Promise<number> | number;
}
