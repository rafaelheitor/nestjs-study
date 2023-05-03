export interface AbstractRepository<T> {
  getAll(): Promise<T[]>;
  getOne(id: string): Promise<T>;
  save(object: T): Promise<T>;
  edit(id: string, payload: any): Promise<T>;
  delete(id: string): Promise<void>;
}
