// components/RequestCard.tsx
import {
  BookOpen,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Clock,
  BadgeHelp,
  Edit
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TutorRequest } from './types';
import { ApplicationsTable } from './ApplicationsTable';

interface RequestCardProps {
  request: TutorRequest;
  onStatusUpdate: (id: string, status: string) => void;
  onEdit: (request: TutorRequest) => void;
}

export function RequestCard({
  request,
  onStatusUpdate,
  onEdit
}: RequestCardProps) {
  return (
    <Card className="flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <Badge
            variant={request.status === 'in review' ? 'default' : 'secondary'}
            className="px-2 py-1 text-xs"
          >
            <BookOpen className="mr-2 h-3 w-3" />
            {request.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={request.user.image} alt={request.user.name} />
            <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{request.user.name}</CardTitle>
            <p className="mt-1 flex items-center text-sm text-gray-500">
              <Calendar className="mr-2 h-3 w-3" />
              {new Date(request.updatedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <Badge variant="outline" className="px-2 py-1 text-xs">
              <User className="mr-2 h-3 w-3" />
              {request.studentLevel.toUpperCase()}
            </Badge>
            <Badge variant="secondary" className="self-start">
              <BookOpen className="mr-2 h-4 w-4" />
              {request.subject}
            </Badge>
          </div>
          <div className="flex flex-wrap justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <BadgeHelp className="h-4 w-4 text-gray-400" />
              <span>{request.mode}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{new Date(request.start).toLocaleDateString('en-GB')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate" title={request.location}>
              {request.location}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>{request.hourly}/hr</span>
          </div>
        </div>
        <p className="line-clamp-3 flex-grow text-sm">{request.requriments}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <div className="flex items-center">
                <span className="px-2">
                  (
                  {request.application.length > 9
                    ? '9+'
                    : request.application.length}
                  )
                </span>
                <User className="mr-2 h-4 w-4" />
                Applications
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-[80vw]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Applicants for {request.subject} Tutor Position</span>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 max-h-[60vh] overflow-auto">
              <ScrollArea className="h-full w-full rounded-md">
                <ApplicationsTable applications={request.application} />
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(request)}>
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusUpdate(request.id, 'in review')}
            >
              In Review
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusUpdate(request.id, 'open')}
            >
              Open
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusUpdate(request.id, 'closed')}
            >
              Closed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
