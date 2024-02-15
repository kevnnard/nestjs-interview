import { Suspense } from 'react';
import { ClientsComponent } from '../_data/components/clients';

export default function AdminClientsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold pb-10 text-center">Clients</h1>
        <ClientsComponent />
      </div>
    </Suspense>
  );
}
