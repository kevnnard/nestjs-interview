import { Suspense } from 'react';
import { TimeSheets } from '../_data/components/timesheets';

export default function AdminTimeSheetsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold pb-10 text-center">TimeSheets</h1>
        <TimeSheets />
      </div>
    </Suspense>
  );
}
