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
import { Icons } from '@ocmi/frontend/ui/global/icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const CreateClientComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Too short,' })
      .max(20, { message: 'Too long,' }),
    email: z.string().max(50, { message: 'Too long,' }).email().regex(/@/),
    password: z.string().max(50, { message: 'Too long,' }),
    company: z.string().max(50, { message: 'Too long,' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      company: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const token = localStorage.getItem('tokenAdmin');
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/admin/create/client`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
        company: values.company,
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
        <Button variant="secondary">Create New Client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Client</DialogTitle>
          <DialogDescription>
            Create a new client in the system by admin and return the user.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Name of the client"
                        type="text"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write a name for this client.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Client
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
