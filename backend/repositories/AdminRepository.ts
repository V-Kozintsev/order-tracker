//AdminRepository.ts
import { DataSource, Repository } from "typeorm";
import { Admin } from "../entities/Admin";

export class AdminRepository {
  private repository: Repository<Admin>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(Admin);
  }

  async findOne(id: number): Promise<Admin | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<Admin | null> {
    return this.repository.findOneBy({ username });
  }

  async create(admin: Admin): Promise<Admin> {
    return this.repository.save(admin);
  }

  async update(id: number, admin: Partial<Admin>): Promise<Admin | null> {
    await this.repository.update(id, admin);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
