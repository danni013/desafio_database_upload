// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  private categoryRepository = getRepository(Category);

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('The type must bu income or outcome', 400);
    }

    const haveMoney = transactionsRepository.getBalance();

    if ((await haveMoney).total < value && type === 'outcome') {
      throw new AppError('No limit available');
    }

    const categoryFound = await this.categoryRepository.findOne({
      where: { title: category },
    });

    if (categoryFound) {
      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category: categoryFound,
      });
      await transactionsRepository.save(transaction);

      return transaction;
    }
    const createdCategory = this.categoryRepository.create({
      title: category,
    });
    await this.categoryRepository.save(createdCategory);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: createdCategory,
    });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
