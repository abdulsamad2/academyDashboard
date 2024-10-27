import { getInvoices } from '@/action/invoice';
import React from 'react'
import InvoicesComponent from './component/invoiceTable';

const page = async () => {
  const invoices = await getInvoices();
  return (
    <InvoicesComponent //@ts-ignore
    data={invoices}/>
  )
}

export default page