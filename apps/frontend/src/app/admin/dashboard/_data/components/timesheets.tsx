/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ocmi/frontend/ui/components/avatar';
import { FormatDateComponentGlobal } from '@ocmi/frontend/ui/global/FormatDate.component';
import { useEffect, useState } from 'react';
import { UpdateTimeSheetComponent } from './updateTimeSheet';

export const TimeSheets = () => {
  const [result, setResult] = useState<[]>([]);

  const getMetadata = () => {
    const token = localStorage.getItem('tokenAdmin');
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/timesheets`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data);
      });
  };

  useEffect(() => {
    getMetadata();
  }, []);

  return (
    <div className="space-y-8">
      {result.map((item: any, index) => (
        <div
          key={index}
          className="flex justify-between items-center hover:bg-slate-300 hover:rounded-lg p-1"
        >
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/01.png" alt="Avatar" />
              <AvatarFallback>{item.client.company}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                Company: {item.client.company}
              </p>
              <p className="text-sm text-muted-foreground">
                Note: {item.note ?? 'No note'}
              </p>
              <p className="text-sm font-medium leading-none">
                <FormatDateComponentGlobal date={item.createdAt} lang="en" />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="ml-auto font-medium bg-dark-300 p-2 rounded-md">
              {item.status}
            </div>
            <UpdateTimeSheetComponent idd={item.id} />
          </div>
        </div>
      ))}
    </div>
  );
};
