import { Model, Document } from 'mongoose';
import { IBaseRepository } from "./IBaseRepository";

abstract class BaseRepository <T extends Document> implements IBaseRepository<T> {

    constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error finding document by id: ${error}`);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const newDocument = new this.model(data);
      return await newDocument.save();
    } catch (error) {
      throw new Error(`Error creating document: ${error}`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating document: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(`Error deleting document: ${error}`);
    }
  }

}


export default BaseRepository