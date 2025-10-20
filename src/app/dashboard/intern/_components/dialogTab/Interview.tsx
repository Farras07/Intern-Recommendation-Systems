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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { formInterviewSchema } from '@/constant/schemas.items';
import { likertScale } from '@/constant/criteriaValue.items';
import FormFieldSelectPiece from '@/app/vacancy/join/_containers/forms/pieces/FormFieldSelectPiece';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useMutation } from '@/hooks/useQuery.hooks';
import { DANGER_TOAST, SUCCESS_TOAST, showToast } from '@/components/Toast';

export default function Interview({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const currentRegisData = useSelector(
    (state: RootState) => state.registerVacancy.regisData,
  );
  console.log(currentRegisData);
  const currentApplyId = useSelector(
    (state: RootState) => state.registerVacancy.currentApplyId,
  );

  const { mutate } = useMutation({
    path: `/intern/vacancy/register/${currentApplyId}`,
    queryKey: ['registrationData'],
    method: 'PUT',
  });

  const formInterview = useForm<z.infer<typeof formInterviewSchema>>({
    resolver: zodResolver(formInterviewSchema),
    defaultValues: {
      interviewRate: currentRegisData?.interviewRate || '1',
    },
  });

  const onSubmit = async (values: z.infer<typeof formInterview>) => {
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

  return (
    <Form {...formInterview}>
      <form onSubmit={formInterview.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              <Typography variant='h6' weight='bold'>
                Interview
              </Typography>
            </CardTitle>
            <CardDescription>
              <Typography variant='c2'>
                Make changes to your account here. Click save when you&apos;re
                done.
              </Typography>
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-6'>
            <div className='grid gap-3'>
              <FormFieldSelectPiece
                name={'interviewRate'}
                control={formInterview.control}
                label={{
                  button: 'Select Interview Rate',
                  sel: 'Interview Rate',
                }}
                choices={likertScale}
                variantTypo='c2'
                colorTypo={'dark'}
                weightTypo='medium'
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
