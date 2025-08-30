import fs from "node:fs/promises";
import { z } from "zod";
import { getDataFilePath } from "../config/index.js";
import { logger } from "../utils/logger.js";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export const CreateUserSchema = UserSchema.omit({ id: true });

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;

class UserService {
  private dataFilePath: string;

  constructor() {
    this.dataFilePath = getDataFilePath();
  }

  async getAllUsers(): Promise<User[]> {
    try {
      logger.debug("Fetching all users");
      const data = await fs.readFile(this.dataFilePath, "utf-8");
      const users = JSON.parse(data) as User[];

      const validatedUsers = users.map(user => UserSchema.parse(user));

      logger.info(`Retrieved ${validatedUsers.length} users`);
      return validatedUsers;
    } catch (error) {
      logger.error("Failed to fetch users", {
        error: error instanceof Error ? error.message : error,
      });
      throw new Error("Failed to fetch users from database");
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      logger.debug(`Fetching user with ID: ${id}`);
      const users = await this.getAllUsers();
      const user = users.find(u => u.id === id);

      if (!user) {
        logger.warn(`User with ID ${id} not found`);
        return null;
      }

      logger.info(`Retrieved user: ${user.name} (ID: ${id})`);
      return user;
    } catch (error) {
      logger.error(`Failed to fetch user with ID ${id}`, {
        error: error instanceof Error ? error.message : error,
      });
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
  }

  async createUser(userData: CreateUser): Promise<User> {
    try {
      logger.debug("Creating new user", { userData });

      const validatedData = CreateUserSchema.parse(userData);
      const users = await this.getAllUsers();
      const newId = Math.max(...users.map(u => u.id), 0) + 1;

      const newUser: User = {
        id: newId,
        ...validatedData,
      };

      users.push(newUser);
      await fs.writeFile(this.dataFilePath, JSON.stringify(users, null, 2));

      logger.info(`Created new user: ${newUser.name} (ID: ${newId})`);
      return newUser;
    } catch (error) {
      logger.error("Failed to create user", {
        userData,
        error: error instanceof Error ? error.message : error,
      });
      throw new Error("Failed to create user");
    }
  }

  async updateUser(
    id: number,
    userData: Partial<CreateUser>
  ): Promise<User | null> {
    try {
      logger.debug(`Updating user with ID: ${id}`, { userData });

      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        logger.warn(`User with ID ${id} not found for update`);
        return null;
      }

      const validatedData = CreateUserSchema.partial().parse(userData);

      users[userIndex] = {
        ...users[userIndex],
        ...validatedData,
      };

      await fs.writeFile(this.dataFilePath, JSON.stringify(users, null, 2));

      logger.info(`Updated user: ${users[userIndex].name} (ID: ${id})`);
      return users[userIndex];
    } catch (error) {
      logger.error(`Failed to update user with ID ${id}`, {
        userData,
        error: error instanceof Error ? error.message : error,
      });
      throw new Error(`Failed to update user with ID ${id}`);
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      logger.debug(`Deleting user with ID: ${id}`);

      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        logger.warn(`User with ID ${id} not found for deletion`);
        return false;
      }

      const deletedUser = users[userIndex];
      users.splice(userIndex, 1);

      // Save to file
      await fs.writeFile(this.dataFilePath, JSON.stringify(users, null, 2));

      logger.info(`Deleted user: ${deletedUser.name} (ID: ${id})`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete user with ID ${id}`, {
        error: error instanceof Error ? error.message : error,
      });
      throw new Error(`Failed to delete user with ID ${id}`);
    }
  }
}

export const userService = new UserService();
