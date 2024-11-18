// import React from 'react'
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
// import { ScrollArea } from '@radix-ui/react-scroll-area';
// import { request } from 'http';
// import { Info, Badge, Clock, BookOpen, BadgeHelp, Calendar, MapPin, Banknote, User, Check } from 'lucide-react';
// import { Button } from 'react-day-picker';

// const ApplicationStatusBadge = ({ status }: { status: string }) => {
//     const getStatusColor = (status: string) => {
//       switch (status.toLowerCase()) {
//         case 'pending':
//           return 'bg-yellow-100 text-yellow-800';
//         case 'accepted':
//           return 'bg-green-100 text-green-800';
//         case 'rejected':
//           return 'bg-red-100 text-red-800';
//         default:
//           return 'bg-gray-100 text-gray-800';
//       }
//     };
  
//     return (
//       <Badge className={`${getStatusColor(status)} px-2 py-1`}>
//         {status === 'accepted' && <Check className="h-3 w-3 mr-1" />}
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };
  
// const DetailRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string, }) => (
//     <div className="flex items-center space-x-3 text-sm">
//       <Icon className="h-4 w-4 text-gray-400" />
//       <span className="font-medium">{label}:</span>
//       <span>{value}</span>
//     </div>
//   );

  
//  export const  JobDetail = () => {
//   return (
// <Dialog>
//     <DialogTrigger asChild>
//       <Button variant="outline" className="w-full">
//         <Info className="h-4 w-4 mr-2" />
//         View Details
//       </Button>
//     </DialogTrigger>
//     <DialogContent className="sm:max-w-[600px]">
//       <DialogHeader>
//         <DialogTitle className="text-xl">{request.subject} Tutoring Request</DialogTitle>
//         <DialogDescription>Reference ID: #{request.id}</DialogDescription>
//       </DialogHeader>
//       <div className="py-4 space-y-6">
//         <div className="flex flex-wrap gap-2">
//           <Badge variant={request.status === 'in review' ? 'default' : 'secondary'}>
//             {request.status}
//           </Badge>
//           {request.hasApplied && (
//             <ApplicationStatusBadge status={request.applicationStatus || 'pending'} />
//           )}
//         </div>
  
//         <div className="grid grid-cols-2 gap-4">
//         <DetailRow icon={Clock} label="Posted" value={new Date(request.createdAt).toLocaleDateString()} />

//           <DetailRow icon={BookOpen} label="Subject" value={request.subject} />
//           <DetailRow icon={BadgeHelp} label="Student Level" value={request.studentLevel} />
//           <DetailRow icon={Calendar} label="Start Date" value={new Date(request.start).toLocaleDateString()} />
//           <div className='col-span-full'>          
//             <DetailRow icon={MapPin} label="Location" value={request.location || 'online'} />
//           </div>
//           <DetailRow icon={Banknote} label="Hourly Rate" value={`${request.hourly}/hr`} />
//           <DetailRow icon={User} label="Student Age" value={request.studentAge} />
//           <DetailRow icon={Calendar} label="Days Available" value={request.dayAvailable} />
//           <DetailRow icon={Clock} label="Time Range" value={request.timeRange} />
//           <DetailRow icon={Clock} label="Hours Per Session" value={request.hoursPerSession} />
//           <DetailRow icon={Calendar} label="Sessions Per Week" value={request.sessionsPerWeek} />
//           <DetailRow icon={Calendar} label="Sessions Per Month" value={request.sessionsPerMonth} />
//         </div>
  
//         <div>
//           <h4 className="font-semibold mb-2">Requirements & Details</h4>
//           <ScrollArea className="h-[200px] w-full rounded-md border p-4">
//             <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.requriments}</p>
//           </ScrollArea>
//         </div>
//       </div>    
//       </DialogContent>
//     </Dialog>  )
// }

