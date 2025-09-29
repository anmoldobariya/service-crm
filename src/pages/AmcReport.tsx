import Header from "@/components/layout/Header";
// import { useAmcReportListMutation, type AmcReport } from "@/store/api/amcReport";
// import { useEffect, useState } from "react";

export default function AmcReportPage() {
  // const [getAmcReportList, { isLoading }] = useAmcReportListMutation();

  // const [amcReportList, setAmcReportList] = useState<AmcReport[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await getAmcReportList({}).unwrap();
  //       setAmcReportList(response?.result);
  //     } catch (error) {
  //       console.error('Failed to fetch services:', error)
  //     }
  //   }

  //   fetchData();
  // }, []);

  return (
    <div className="h-full w-full p-4 flex flex-col gap-2">
      <Header title={"AMC Report"} options={null} />
      Amc Report Page Coming Soon...
      <div className='flex-1 min-h-0'>
        {/* <DataTable
          table={UserTable}
          isLoading={isFetching}
        /> */}
      </div>
    </div>
  )
}