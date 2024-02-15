/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ocmi/frontend/ui/components/avatar';
import { FormatDateComponentGlobal } from '@ocmi/frontend/ui/global/FormatDate.component';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const ClientsComponent = () => {
  const [result, setResult] = useState<[]>([]);

  const getMetadata = () => {
    const token = localStorage.getItem('tokenAdmin');
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/admin/clients`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data);
      })
      .catch((error) => {
        toast('Error:', error);
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    getMetadata();
  }, []);

  return (
    <div className="space-y-8">
      {result.length !== 0 &&
        result.map((item: any, index) => (
          <div
            key={index}
            className="flex justify-between items-center hover:bg-slate-300 hover:rounded-lg p-1"
          >
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/01.png" alt="Avatar" />
                <AvatarFallback>{item.company}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Name: {item.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {item.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Company: {item.company}
                </p>
                <p className="text-sm font-medium leading-none">
                  <FormatDateComponentGlobal date={item.createdAt} lang="en" />
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
