import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "123456",
        totalAmount: "28/Male",
        paymentMethod: "Abid Hossain Biswas",
        department: "Orthopedics",
        country: "Bangladesh",
        date:"10 Jan 2025"
    },
    {
        invoice: "INV002",
        paymentStatus: "123456",
        totalAmount: "28/Female",
        paymentMethod: "A Dummy Girl",
        department:"Orthopedics",
        country:"Bangladesh",
        date:"10 Jan 2025"
    },
    {
        invoice: "INV003",
        paymentStatus: "123456",
        totalAmount: "28/Male",
        paymentMethod: "Abid Hossain Biswas",
        department:"Orthopedics",
        country:"Bangladesh",
        date:"10 Jan 2025"
    },
    {
        invoice: "INV004",
        paymentStatus: "123456",
        totalAmount: "28/Male",
        paymentMethod: "Abid Hossain Biswas",
        department:"Orthopedics",
        country:"Bangladesh",
        date:"10 Jan 2025"
    },
    {
        invoice: "INV005",
        paymentStatus: "123456",
        totalAmount: "28/Male",
        paymentMethod: "Abid Hossain Biswas",
        department:"Orthopedics",
        country:"Bangladesh",
        date:"10 Jan 2025"

    },
    {
        invoice: "INV006",
        paymentStatus: "123456",
        totalAmount: "$200.00",
        paymentMethod: "Abid Hossain Biswas",
        department: "Orthopedics",
        country: "Bangladesh",
        date:"10 Jan 2025"

    },
    {
        invoice: "INV007",
        paymentStatus: "123456",
        totalAmount: "$300.00",
        paymentMethod: "Abid Hossain Biswas",
        department: "Orthopedics",
        country:"Bangladesh",
        date:"10 Jan 2025"
    },
]

export function InPatitentTable() {
    return (
        <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
                <TableRow className={`text-[#7F7F7F]`}>
                    <TableHead className="text-[#7F7F7F] font-normal">No.</TableHead>
                    <TableHead className="text-[#7F7F7F] font-normal">UHID</TableHead>
                    <TableHead className="text-[#7F7F7F] font-normal">Name</TableHead>
                    <TableHead className="text-[#7F7F7F] font-normal text-center">Age/Gender</TableHead>
                    <TableHead className="text-[#7F7F7F] font-normal">Department</TableHead>
                    <TableHead className="text-[#7F7F7F] font-normal">Country</TableHead>
                    <TableHead className="text-[#7F7F7F] font-normal">Appointment Date</TableHead>
                    <TableHead className="text-[#7F7F7F] font-normal">Status</TableHead>
                    <TableHead className="text-[#7F7F7F] font-normal">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice,index) => (
                    <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell >{invoice.paymentMethod}</TableCell>
                        <TableCell className={`text-center`}>{invoice.totalAmount}</TableCell>
                        <TableCell >{invoice.department}</TableCell>
                        <TableCell>{invoice.country}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell className="">{invoice.totalAmount}</TableCell>
                        <TableCell className="">{invoice.totalAmount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            {/* <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter> */}
        </Table>
    )
}
