import { CategoryRepository } from "@/repositories/CategoryRepository";

export class CategoryService{
  private categoryRepository = new CategoryRepository();

  async getAllCategories(){
    return this.categoryRepository.findAll();
  }
}