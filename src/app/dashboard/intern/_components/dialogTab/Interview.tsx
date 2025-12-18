import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import Typography from '@/components/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { formInterviewSchema } from '@/constant/schemas.items';
import { likertScale } from '@/constant/criteriaValue.items';
import FormFieldSelectPiece from '@/app/vacancy/join/_containers/forms/pieces/FormFieldSelectPiece';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useMutation } from '@/hooks/useQuery.hooks';
import { VacancyRegisType } from '@/types/registDataTypes';
import { useSession } from 'next-auth/react';

export default function Interview({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const currentRegisData = useSelector(
    (state: RootState) => state.registerVacancy.regisData,
  );

  const [vacancy, setVacancy] = useState<VacancyRegisType[]>([]);

  useEffect(() => {
    if (currentRegisData?.vacancy) {
      setVacancy(currentRegisData.vacancy);
    }
  }, [currentRegisData]);

  const currentApplyId = useSelector(
    (state: RootState) => state.registerVacancy.currentApplyId,
  );

  const { mutate } = useMutation({
    path: `/intern/vacancy/register/${currentApplyId}`,
    queryKey: ['registrationData'],
    method: 'PUT',
    successMessage: 'Update Registration Data Success',
    errorMessage: 'Update Registration Data Failed',
  });

  const formInterview = useForm<{
    interviewList: z.infer<typeof formInterviewSchema>;
  }>({
    resolver: zodResolver(z.object({ interviewList: formInterviewSchema })),
    defaultValues: {
      interviewList: vacancy.map(vac => ({
        idVacancy: vac.id,
        interviewRate: String(vac.interviewRate) || '1',
      })),
    },
  });

  const { fields } = useFieldArray({
    control: formInterview.control,
    name: 'interviewList',
  });

  useEffect(() => {
    if (vacancy.length > 0) {
      formInterview.reset({
        interviewList: vacancy.map(vac => ({
          idVacancy: vac.id,
          interviewRate: String(vac.interviewRate) || '1',
        })),
      });
    }
  }, [vacancy]);

  const onSubmit = async (values: {
    interviewList: z.infer<typeof formInterviewSchema>;
  }) => {
    const interviewMap = new Map(
      values.interviewList.map(int => [
        int.idVacancy,
        Number(int.interviewRate),
      ]),
    );
    const updatedVacancy = vacancy.map(vac => {
      const { ...rest } = vac;
      return {
        ...rest,
        interviewRate: interviewMap.get(vac.id) || vac.interviewRate,
      };
    });

    mutate({ vacancy: updatedVacancy });
    onOpenChange(false);
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
              {fields.map((field, index) => (
                <FormFieldSelectPiece
                  key={field.id}
                  name={`interviewList.${index}.interviewRate`}
                  control={formInterview.control}
                  label={{
                    button: `${vacancy[index]?.role?.title || 'Unknown'} Interview Rate`,
                    sel: 'Interview Rate',
                  }}
                  choices={likertScale}
                  variantTypo='c2'
                  colorTypo='dark'
                  weightTypo='medium'
                />
              ))}
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
