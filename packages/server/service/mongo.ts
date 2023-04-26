import { MongoClient, Db, Collection, Document, ServerApiVersion, InsertOneResult, DeleteResult } from 'mongodb';
import { MongoConfig } from '../config';
import { CatchError } from '../decorator';

export default class MongoDBService {

  private client: MongoClient;
  private db: Db;

  @CatchError()
  public async connect() {
    this.client = new MongoClient(MongoConfig.databaseUrl, {});
    await this.client.connect();
    this.db = this.client.db(MongoConfig.databaseName);
    
    console.log('连接到MognoDB数据库');
  }

  @CatchError()
  public async insertOne<T>(collectionName: string, doc: T): Promise<InsertOneResult<Document>> {
    const collection: Collection = this.db.collection(collectionName);
    return  await collection.insertOne(doc); 
  }

  @CatchError()
  public async findOne(collectionName: string, match: object, filter?:object): Promise<Document> {
    const collection: Collection = this.db.collection(collectionName);
    const result = await collection.findOne(match, filter);
    return result;
  }

  @CatchError()
  public async find(collectionName: string, match: object, filter?: object): Promise<Document> {
    const collection: Collection = this.db.collection(collectionName);
    return await collection.find(match, filter).toArray();
  }

  @CatchError()
  public async updateOne<T>(collectionName: string, filter: object, update: object): Promise<Document> {
    const collection: Collection = this.db.collection(collectionName);
    return await collection.updateOne(filter, { $set: update });
  }

  @CatchError()
  public async deleteOne(collectionName: string, filter: object): Promise<DeleteResult> {
    const collection: Collection = this.db.collection(collectionName);
    return await collection.deleteOne(filter);
  }

  @CatchError()
  public close() {
    this.client.close();
  }
}
