import { auth } from '@/auth';
import ParentBilling from './components/billing';
import { getInvoicesForParent } from '@/action/invoice';
import { getSecurityDepositByParentId } from '@/action/securityDeposit';

const page = async () => {
  const session = await auth();
  //@ts-ignore
  const id = session.id;
  const invoices = await getInvoicesForParent(id);
  const deposits = await getSecurityDepositByParentId(id);

  return (
    //@ts-ignore
    <ParentBilling deposits={deposits} invoices={invoices} />
  );
};

export default page;
