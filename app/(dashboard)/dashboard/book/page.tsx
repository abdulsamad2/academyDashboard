import BookAdmin from './components/uploadBook';
import { db as prisma } from '@/db/db';

export default async function Page() {
  const books = await prisma.book.findMany();
  const uniqueFilter = Array.from(
    new Set(
      books.map((book) =>
        JSON.stringify({ category: book.category, level: book.level })
      )
    )
  ).map((item) => JSON.parse(item));

  return <BookAdmin filter={uniqueFilter} books={books} />;
}
