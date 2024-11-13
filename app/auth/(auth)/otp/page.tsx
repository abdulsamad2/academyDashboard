import { sendOTP } from "@/action/sendOtpt"

const page = async() => {
    const res = await sendOTP('+923013485627')
    console.log(res)
  return (
    <div>page</div>
  )
}

export default page