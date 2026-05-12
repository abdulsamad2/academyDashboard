'use server';

import { db } from '@/db/db';

export const deleteDb = async (id: number, modelName: string) => {
  try {
    //@ts-ignore
    const model = db[modelName];
    if (!model) {
      throw new Error(`Model ${modelName} does not exist`);
    }

    const res = await model.delete({ where: { id } });
    return res;
  } catch (error) {
    console.error(
      `Error deleting record with ID ${id} from model ${modelName}:`,
      error
    );
    throw error;
  }
};
