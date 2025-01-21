'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Book, PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react';
import EnhancedUpload from '@/components/cloudinaryUpload';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import BookReader from '@/components/bookReader';
import BookFilter from '@/components/bookFilter';

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

const BookAdmin = ({ books: initialBooks, filter }: { books: BookType[], filter: any }) => {
  const { toast } = useToast();
  const [books, setBooks] = useState<BookType[]>(initialBooks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    pdfUrl: '',
    category: '',
    level: ''
  });
const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
const [selectedCategory, setSelectedCategory] = useState('');
const [selectedLevel, setSelectedLevel] = useState('');

// Add this function to get filtered books
const filteredBooks = books.filter((book) => {
  const matchesCategory =
    !selectedCategory || book.category === selectedCategory;
  const matchesLevel = !selectedLevel || book.level === selectedLevel;
  return matchesCategory && matchesLevel;
});

  // Update form data when editing book changes
  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        description: editingBook.description || '',
        coverImage: editingBook.coverImage || '',
        pdfUrl: editingBook.pdfUrl,
        category: editingBook.category || '',
        level: editingBook.level || ''
      });
    }
  }, [editingBook]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  const handlePdfUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, pdfUrl: url }));
  };
const handleReset = () => {
  setSelectedCategory('');
  setSelectedLevel('');
};
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      coverImage: '',
      pdfUrl: '',
      category: '',
      level: ''
    });
    setEditingBook(null);
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingBook ? `/api/books/${editingBook.id}` : '/api/books';

      const method = editingBook ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.message || `Failed to ${editingBook ? 'update' : 'create'} book`
        );
      }

      const book = await res.json();

      setBooks((prev) => {
        if (editingBook) {
          return prev.map((b) => (b.id === book.id ? book : b));
        }
        return [book, ...prev];
      });

      toast({
        title: 'Success!',
        description: `Book has been successfully ${
          editingBook ? 'updated' : 'added'
        }.`
      });

      resetForm();
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to save book. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete book');
      }

      setBooks((prev) => prev.filter((book) => book.id !== bookId));

      toast({
        title: 'Success!',
        description: 'Book has been successfully deleted.'
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete book. Please try again.'
      });
    }
  };

  const handleEdit = (book: BookType) => {
    setEditingBook(book);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className='flex flex-col space-y-4 pb-5'>
        <h1 className="text-3xl font-bold">Book Management</h1>
        <p className="text-muted-foreground">
          Add, edit, and manage books for tutors and parents
        </p>
      </div>
      <BookFilter
        filters={filter}
        selectedCategory={selectedCategory}
        selectedLevel={selectedLevel}
        onCategoryChange={setSelectedCategory}
        onLevelChange={setSelectedLevel}
        onReset={handleReset}
      />
      <div className="mb-6 mt-3 flex items-center justify-between">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </DialogTitle>
              <DialogDescription>
                {editingBook
                  ? 'Edit the book details below.'
                  : 'Upload a book with its cover image and details.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter book title"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter book description"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Category</Label>
                  <Input
                    className="focus:ring-primary-500 w-full rounded-lg border bg-transparent px-4 py-2 focus:outline-none focus:ring"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Enter book category"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Level</Label>
                  <Input
                    className="w-full rounded-lg border bg-transparent px-4 py-2  "
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    placeholder="Enter book level"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Cover Image</Label>
                  <EnhancedUpload
                    title="Upload Cover"
                    onUpload={handleCoverUpload}
                    initialUrl={formData.coverImage}
                    acceptedFileTypes={['image/*']}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>PDF File</Label>
                  <EnhancedUpload
                    title="Upload PDF"
                    onUpload={handlePdfUpload}
                    initialUrl={formData.pdfUrl}
                    acceptedFileTypes={['application/pdf']}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title || !formData.pdfUrl}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingBook ? 'Updating...' : 'Saving...'}
                    </>
                  ) : editingBook ? (
                    'Update Book'
                  ) : (
                    'Save Book'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="flex flex-col overflow-hidden">
            <div
              className="relative aspect-[4/3] w-full cursor-pointer"
              onClick={() => setSelectedBook(book)}
            >
              {book.coverImage ? (
                <Image
                  fill
                  src={`/api/media/${book.coverImage}`}
                  alt={book.title}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <Book className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle
                className="cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                {book.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {book.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(book)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this book?')) {
                      handleDelete(book.id);
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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

export default BookAdmin;
