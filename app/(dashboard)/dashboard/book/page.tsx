import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PrismaClient } from '@prisma/client';
import BookAdmin from './components/uploadBook';
const prisma = new PrismaClient();



type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const books = await prisma.book.findMany();
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  //@ts-ignore
    //@ts-ignore
  const totalUsers = books.length; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
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
