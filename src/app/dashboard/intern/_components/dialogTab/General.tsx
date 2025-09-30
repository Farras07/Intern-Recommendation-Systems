import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Typography from '@/components/Typography';
import { useForm } from 'react-hook-form';
import { formUpdateGeneralVacancySchema } from '@/constant/schemas.items';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useQuery } from '@/hooks/useQuery.hooks';
import FormFieldInputPiece from '@/app/vacancy/join/_containers/forms/pieces/FormFieldInputiece';
import { setRegisData } from '@/lib/redux/slices/registerSlice';
import { useDispatch } from 'react-redux';
import { useMutation } from '@/hooks/useQuery.hooks';
import { DANGER_TOAST, SUCCESS_TOAST, showToast } from '@/components/Toast';
import Loading from '@/app/Loading';
import { useEffect } from 'react';

export default function General({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useDispatch();
  const currentApplyId = useSelector(
    (state: RootState) => state.registerVacancy.currentApplyId,
  );

  const { mutate } = useMutation({
    path: `/intern/vacancy/register/${currentApplyId}`,
    queryKey: ['registrationData'],
    method: 'PUT',
  });

  const { data, isLoading, isError } = useQuery({
    path: `/intern/vacancy/register/${currentApplyId}`,
    queryKey: ['registrationData'],
  });
  if (!isLoading && !isError) {
    dispatch(setRegisData(data));
  }

  const formGeneral = useForm<z.infer<typeof formUpdateGeneralVacancySchema>>({
    resolver: zodResolver(formUpdateGeneralVacancySchema),
    defaultValues: {
      name: '',
      educationInstitution: '',
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formGeneral>) => {
    const toast = { message: '', type: DANGER_TOAST };
    try {
      mutate(values);
      toast.message = 'Update Registration Data Success';
      toast.type = SUCCESS_TOAST;
    } catch (error) {
      toast.message = `Update Registration Data Failed: ${error}`;
    } finally {
      showToast(toast.message, toast.type);
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (data) {
      formGeneral.reset({
        name: data.name,
        educationInstitution: data.educationInstitution,
        phone: data.phone,
      });
    }
  }, [data, formGeneral]);
  if (isLoading) return <Loading />;

  return (
    <Form {...formGeneral}>
      <form onSubmit={formGeneral.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              <Typography variant='h6' weight='bold'>
                General
              </Typography>
            </CardTitle>
            <CardDescription>
              <Typography variant='c2'>
                Make changes to your account here. Click save when
                you&apos;redone.
              </Typography>
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-6'>
            <div className='grid gap-3'>
              <Typography variant='btn' weight='medium'>
                Email
              </Typography>
              <Typography variant='btn' weight='regular'>
                {!isLoading ? data.email : ''}
              </Typography>
            </div>
            <div className='grid gap-3'>
              <FormFieldInputPiece
                name={`name`}
                control={formGeneral.control}
                inputType={'text'}
                placeholder={'Your Name'}
                label={'Name'}
                variantTypo={'btn'}
                colorTypo={'dark'}
                weightTypo={'medium'}
              />
            </div>
            <div className='grid gap-3'>
              <FormFieldInputPiece
                name={`phone`}
                control={formGeneral.control}
                inputType={'text'}
                placeholder={'Your Phone'}
                label={'Phone'}
                variantTypo={'btn'}
                colorTypo={'dark'}
                weightTypo={'medium'}
              />
            </div>
            <div className='grid gap-3'>
              <FormFieldInputPiece
                name={`educationInstitution`}
                control={formGeneral.control}
                inputType={'text'}
                placeholder={'Your Education Institution'}
                label={'Education Institution'}
                variantTypo={'btn'}
                colorTypo={'dark'}
                weightTypo={'medium'}
              />
            </div>
          </CardContent>
          <DialogFooter>
            <CardFooter className='flex justify-center gap-2 p-8'>
              <DialogClose asChild>
                <Button className='cursor-pointer'>Cancel</Button>
              </DialogClose>
              <Button type='submit' className='cursor-pointer'>
                Save Changes
              </Button>
            </CardFooter>
          </DialogFooter>
        </Card>
      </form>
    </Form>
  );
}
