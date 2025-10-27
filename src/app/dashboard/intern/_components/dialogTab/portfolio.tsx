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
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { formPortfolioSchema } from '@/constant/schemas.items';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { likertScale } from '@/constant/criteriaValue.items';
import FormFieldSelectPiece from '@/app/vacancy/join/_containers/forms/pieces/FormFieldSelectPiece';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useMutation } from '@/hooks/useQuery.hooks';
import { DANGER_TOAST, SUCCESS_TOAST, showToast } from '@/components/Toast';
import { VacancyRegisType } from '@/types/registDataTypes';

export default function Portfolio({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const currentRegisData = useSelector(
    (state: RootState) => state.registerVacancy.regisData,
  );
  const currentApplyId = useSelector(
    (state: RootState) => state.registerVacancy.currentApplyId,
  );

  const [vacancy, setVacancy] = useState<VacancyRegisType[]>([]);
  const { mutate } = useMutation({
    path: `/intern/vacancy/register/${currentApplyId}`,
    queryKey: ['registrationData'],
    method: 'PUT',
  });

  useEffect(() => {
    if (currentRegisData?.vacancy) {
      setVacancy(currentRegisData.vacancy);
    }
  }, [currentRegisData]);

  const formPortfolio = useForm<{
    portfolioList: z.infer<typeof formPortfolioSchema>;
  }>({
    resolver: zodResolver(z.object({ portfolioList: formPortfolioSchema })),
    defaultValues: {
      portfolioList: vacancy.map(vac => ({
        idVacancy: vac.id,
        portfolioRate: String(vac.portfolio.rate) || '1',
      })),
    },
  });

  const { fields } = useFieldArray({
    control: formPortfolio.control,
    name: 'portfolioList',
  });

  useEffect(() => {
    if (vacancy.length > 0) {
      formPortfolio.reset({
        portfolioList: vacancy.map(vac => ({
          idVacancy: vac.id,
          portfolioRate: String(vac.portfolio.rate) || '1',
        })),
      });
    }
  }, [vacancy]);

  const onSubmit = async (values: {
    portfolioList: z.infer<typeof formPortfolioSchema>;
  }) => {
    const toast = { message: '', type: DANGER_TOAST };
    const portfolioMap = new Map(
      values.portfolioList.map(int => [
        int.idVacancy,
        Number(int.portfolioRate),
      ]),
    );
    const updatedVacancy = vacancy.map(vac => ({
      ...vac,
      portfolio: {
        link: vac.portfolio.link,
        rate: portfolioMap.get(vac.id) || vac.portfolio.rate,
      },
    }));

    try {
      mutate({ vacancy: updatedVacancy });
      toast.message = 'Update Portfolio Rate Success';
      toast.type = SUCCESS_TOAST;
    } catch (error) {
      toast.message = `Update Portfolio Rate Failed: ${error}`;
      console.error(error);
    } finally {
      showToast(toast.message, toast.type);
      onOpenChange(false);
    }
  };

  return (
    <Form {...formPortfolio}>
      <form onSubmit={formPortfolio.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              <Typography variant='h6' weight='bold'>
                Portfolio
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
                  name={`portfolioList.${index}.portfolioRate`}
                  control={formPortfolio.control}
                  label={{
                    button: `${vacancy[index]?.role?.title || 'Unknown'} Portfolio Rate`,
                    sel: 'Portfolio Rate',
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
