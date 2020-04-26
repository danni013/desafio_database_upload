import { EntityRepository, Repository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactionIn = this.find({
      where: { type: 'income' },
    });

    const totalIn: number = (await transactionIn).reduce(
      (total: number, { value }) => {
        return total + value;
      },
      0,
    );

    const transactionOut = this.find({
      where: { type: 'outcome' },
    });

    const totalOut: number = (await transactionOut).reduce(
      (total: number, { value }) => {
        return total + value;
      },
      0,
    );

    const totalBalance: number = totalIn - totalOut;

    const { income, outcome, total }: Balance = {
      income: totalIn,
      outcome: totalOut,
      total: totalBalance,
    };
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
