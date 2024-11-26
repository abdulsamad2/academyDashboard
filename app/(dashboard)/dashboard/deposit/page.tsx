import { getInvoices } from '@/action/invoice';
import React from 'react';
import InvoicesComponent from './component/invoiceTable';
import { getAllSecurityDeposits } from '@/action/securityDeposit';

const page = async () => {
  const deposits = await getAllSecurityDeposits();
  console.log(deposits);
  return (
    <InvoicesComponent //@ts-ignore
      data={deposits}
    />
  );
};

export default page;
