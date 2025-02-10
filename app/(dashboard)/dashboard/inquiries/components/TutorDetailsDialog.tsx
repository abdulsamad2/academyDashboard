import { Phone, MapPin, Mail, BookOpen, ExternalLink } from 'lucide-react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Application } from './types';
import Link from 'next/link';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key } from 'react';

export function TutorDetailsDialog({ tutor }: { tutor: Application }) {
  return (
    <DialogContent className="max-h-[90vh] p-0 sm:max-w-[600px]">
      <DialogHeader className="p-6 pb-4">
        <DialogTitle className="text-xl font-semibold">
          Tutor Details
        </DialogTitle>
      </DialogHeader>

      <ScrollArea className="max-h-[calc(90vh-8rem)]">
        <div className="space-y-6 px-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20 rounded-md border">
              <AvatarImage src={tutor.tutor.image} alt={tutor.tutor.name} />
              <AvatarFallback className="rounded-md">
                {tutor.tutor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold">{tutor.tutor.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{tutor.tutor.email}</span>
              </div>
              {tutor.tutor.subjects && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tutor.tutor.subjects.map((subject: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined, index: Key | null | undefined) => (
                    <Badge key={index} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{tutor.tutor.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{tutor.tutor.address}</span>
              </div>
            </CardContent>
          </Card>

          {tutor.tutor.experience && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {tutor.tutor.experience}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-md">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {tutor.coverLetter}
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 pt-4">
          <Separator className="mb-4" />
          <DialogFooter>
            <Button asChild>
              <Link href={`/dashboard/tutors/${tutor.tutor.id}`} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Full Profile
              </Link>
            </Button>
          </DialogFooter>
        </div>
      </ScrollArea>
    </DialogContent>
  );
}
