import { auth } from "@/auth"
import ParentBilling from "./components/billing"
import { getInvoicesForParent } from "@/action/invoice";

const page =  async() => {
  const session = await auth();
  //@ts-ignore
  const id = session.id;
const invoices = await getInvoicesForParent(id)


  return (
    //@ts-ignore
    <ParentBilling invoices = {invoices}/>
  )
}

export default page