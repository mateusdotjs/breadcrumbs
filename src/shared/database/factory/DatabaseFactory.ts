import { LogRepository } from "../interfaces/LogRepository.js";
import { ProjectRepository } from "../interfaces/ProjectRepository.js";
import { UserRepository } from "../interfaces/UserRepository.js";
import { MongoLogRepository } from "../repositories/mongodb/LogRepository.js";
import { MongoProjectRepository } from "../repositories/mongodb/ProjectRepository.js";
import { MongoUserRepository } from "../repositories/mongodb/UserRepository.js";

export class DatabaseFactory {
  static createLogRepository(): LogRepository {
    const dbType = process.env.DB_TYPE || 'mongodb';
    
    switch (dbType) {
      case 'mongodb':
        return new MongoLogRepository();
      case 'dynamodb':
        throw new Error('DynamoDB implementation not available yet');
      default:
        throw new Error(`Unsupported DB type: ${dbType}`);
    }
  }

  static createProjectRepository(): ProjectRepository {
    const dbType = process.env.DB_TYPE || 'mongodb';
    
    switch (dbType) {
      case 'mongodb':
        return new MongoProjectRepository();
      case 'dynamodb':
        throw new Error('DynamoDB implementation not available yet');
      default:
        throw new Error(`Unsupported DB type: ${dbType}`);
    }
  }

  static createUserRepository(): UserRepository {
    const dbType = process.env.DB_TYPE || 'mongodb';
    
    switch (dbType) {
      case 'mongodb':
        return new MongoUserRepository();
      case 'dynamodb':
        throw new Error('DynamoDB implementation not available yet');
      default:
        throw new Error(`Unsupported DB type: ${dbType}`);
    }
  }
}
