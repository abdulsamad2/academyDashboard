import React from 'react'
import BookViewer from '@/components/listBooks'
import { db } from '@/db/db'

export default async function page() {
  const books = await db.book.findMany();
const uniqueFilter = Array.from(
  new Set(
    books.map((book) =>
      JSON.stringify({ category: book.category, level: book.level })
    )
  )
).map((item) => JSON.parse(item));

  return (
    <div>
      <BookViewer books={books} filter={uniqueFilter} />
    </div>
  );
}
