'use client';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { User } from '@prisma/client';

interface ProductsClientProps {
  data: User[];
}

export const UserClient: React.FC<ProductsClientProps> = ({ data }) => {

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Users (${data.length})`}
          description="Manage users (Client side table functionalities.)"
        />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns}
        //@ts-ignore
        data={data} />
    </>
  );
};
