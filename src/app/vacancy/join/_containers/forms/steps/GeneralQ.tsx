import { setStep, setData } from '@/lib/redux/slices/formSlice';
import { RootState } from '@/lib/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Typography from '@/components/Typography';
import { formGeneralQVacancySchema } from '@/constant/schemas.items';
import FormFieldInputPiece from '../pieces/FormFieldInputiece';
import { MoveLeft, MoveRight } from 'lucide-react';

export default function GeneralQ() {
  const dispatch = useDispatch();
  const dataForm = useSelector((state: RootState) => state.form.data);
  const formQGeneral = useForm<z.infer<typeof formGeneralQVacancySchema>>({
    resolver: zodResolver(formGeneralQVacancySchema),
    defaultValues: {
      name: dataForm.name || '',
      email: dataForm.email || '',
      cv: dataForm.cv || '',
      educationInstitution: dataForm.educationInstitution || '',
      phone: dataForm.phone || '',
    },
  });

  const onNext = async (values: z.infer<typeof formGeneralQVacancySchema>) => {
    console.log(values);
    dispatch(setData(values));
    dispatch(setStep({ type: 'Next' }));
  };

  const onBack = () => {
    dispatch(setStep({ type: 'Back' }));
  };

  return (
    <Form {...formQGeneral}>
      <form
        onSubmit={formQGeneral.handleSubmit(onNext)}
        className='h-full w-full flex flex-col justify-between'
      >
        {/* Form Container */}
        <div className='flex-1 flex justify-center px-8 py-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl bg-lightgray/20 shadow-lg rounded-2xl p-10'>
            {/* Left Column */}
            <div className='flex flex-col gap-8'>
              <FormFieldInputPiece
                name={'name'}
                control={formQGeneral.control}
                placeholder={'Type Your Full name'}
                inputType={'text'}
                label={'Full Name'}
              />
              <FormFieldInputPiece
                name={'email'}
                control={formQGeneral.control}
                placeholder={'Type Your Email'}
                inputType={'email'}
                label={'Email'}
              />
              <FormFieldInputPiece
                name={'phone'}
                control={formQGeneral.control}
                placeholder={'Type Your Phone Number'}
                inputType={'text'}
                label={'Phone Number'}
              />
            </div>

            {/* Right Column */}
            <div className='flex flex-col gap-8'>
              <FormFieldInputPiece
                name={'educationInstitution'}
                control={formQGeneral.control}
                placeholder={'Type Your Education Institution'}
                inputType={'text'}
                label={'Education Institution'}
              />
              <FormFieldInputPiece
                name={'cv'}
                control={formQGeneral.control}
                inputType={'url'}
                placeholder={'Type Curriculum Vitae Link Drive'}
                label={'Upload Curriculum Vitae'}
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className='flex justify-center gap-8 pb-12'>
          <Button
            variant={'hero-card'}
            type='button'
            className='cursor-pointer hover:bg-amber-300 flex items-center gap-2 rounded-xl px-6 py-3 shadow-md transition-all'
            onClick={onBack}
          >
            <MoveLeft />
            <Typography color='dark' weight='semibold'>
              Back
            </Typography>
          </Button>
          <Button
            variant={'hero-card'}
            type='submit'
            className='cursor-pointer hover:bg-amber-300 flex items-center gap-2 rounded-xl px-6 py-3 shadow-md transition-all'
          >
            <Typography color='dark' weight='semibold'>
              Next
            </Typography>
            <MoveRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}
