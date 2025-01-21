'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, BookOpen, Search } from 'lucide-react';
import Image from 'next/image';
import BookReader from '@/components/bookReader';
import BookFilter from '@/components/bookFilter';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type BookType = {
  level: string;
  category: string;
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  pdfUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

const BookViewer = ({
  books: initialBooks,
  filter
}: {
  books: BookType[];
  filter: any;
}) => {
  const [books] = useState<BookType[]>(initialBooks);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter books based on category, level, and search term
  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      !selectedCategory || book.category === selectedCategory;
    const matchesLevel = !selectedLevel || book.level === selectedLevel;
    const matchesSearch =
      !searchTerm ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedLevel('');
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="space-y-4 pb-6">
        <h1 className="text-3xl font-bold">Library</h1>
        <p className="text-muted-foreground">
          Explore our collection of books and learning materials
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-6 rounded-lg border bg-card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <BookFilter
          filters={filter}
          selectedCategory={selectedCategory}
          selectedLevel={selectedLevel}
          onCategoryChange={setSelectedCategory}
          onLevelChange={setSelectedLevel}
          onReset={handleReset}
        />
      </div>

      {/* Books Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div
              className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden"
              onClick={() => setSelectedBook(book)}
            >
              {book.coverImage ? (
                <Image
                  fill
                  src={`/api/media/${book.coverImage}`}
                  alt={book.title}
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <Book className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              {/* Overlay with Read button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 left-4 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => setSelectedBook(book)}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Now
                </Button>
              </div>
            </div>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle
                  className="line-clamp-1 cursor-pointer hover:text-primary"
                  onClick={() => setSelectedBook(book)}
                >
                  {book.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{book.category}</Badge>
                  <Badge variant="outline">{book.level}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {book.description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {filteredBooks.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            No books found matching your criteria.
          </p>
        </div>
      )}

      {/* Book Reader */}
      {selectedBook && (
        <BookReader
          url={selectedBook.pdfUrl}
          title={selectedBook.title}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          isPdf={selectedBook.pdfUrl.toLowerCase().endsWith('.pdf')}
        />
      )}
    </div>
  );
};

export default BookViewer;
