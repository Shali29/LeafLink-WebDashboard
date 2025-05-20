import PaymentReceiptClient from "./PaymentReceiptClient"

interface Payment {
  PaymentsID: number
  S_RegisterID: string
  S_FullName: string
  Supplier_Loan_Amount: number
  Supplier_Advance_Amount: number
  TeaPackets_Fertilizers_Amount: number
  Transport_Charge: number
  Final_Total_Salary: number
  Date: string
  Status: string
}

interface PageProps {
  params: { id: string }
}

async function getPayment(id: string): Promise<Payment | null> {
  const res = await fetch(`https://backend-production-f1ac.up.railway.app/api/supplierPayment/${id}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export default async function PaymentReceiptPage({ params }: PageProps) {
  const payment = await getPayment(params.id)

  if (!payment) {
    return <div className="p-4 text-center text-red-600">Payment not found.</div>
  }

  return <PaymentReceiptClient payment={payment} />
}
