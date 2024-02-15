'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@ocmi/frontend/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ocmi/frontend/ui/components/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ocmi/frontend/ui/components/form';
import { Input } from '@ocmi/frontend/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ocmi/frontend/ui/components/select';
import { Icons } from '@ocmi/frontend/ui/global/icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const UpdateTimeSheetComponent = ({ idd }: { idd: number }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z.object({
    note: z
      .string()
      .min(2, { message: 'Too short,' })
      .max(20, { message: 'Too long,' }),
    status: z.string().max(50, { message: 'Too long,' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: '',
      status: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const token = localStorage.getItem('tokenAdmin');
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/timesheet/${idd}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note: values.note,
        status: values.status,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success('Update successfully');
      })
      .catch((error) => {
        toast.success(error.message);
        console.log(error);
      });

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a note or change the state</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="note">Note</FormLabel>
                    <FormControl>
                      <Input
                        id="note"
                        placeholder="Your note"
                        type="text"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write a note for this timesheet.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="status">
                      Status for this timesheet
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" id="status" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem
                            value="APPROVED"
                            className="cursor-pointer"
                          >
                            APPROVED
                          </SelectItem>
                          <SelectItem
                            value="REJECTED"
                            className="cursor-pointer"
                          >
                            REJECTED
                          </SelectItem>
                          <SelectItem
                            value="PENDING"
                            className="cursor-pointer"
                          >
                            PENDING
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the status for this timesheet.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In with Email
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
