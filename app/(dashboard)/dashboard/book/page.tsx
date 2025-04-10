
import { PrismaClient } from '@prisma/client';
import BookAdmin from './components/uploadBook';
const prisma = new PrismaClient();



type paramsProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function page(props: paramsProps) {
  const books = await prisma.book.findMany();
  //@ts-ignore
  //@ts-ignore
  const uniqueFilter = Array.from(
    new Set(
      books.map((book) =>
        JSON.stringify({ category: book.category, level: book.level })
      )
    )
  ).map((item) => JSON.parse(item));




  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        

        <BookAdmin filter={uniqueFilter} books={books} />
      </div>
    </>
  );
}
