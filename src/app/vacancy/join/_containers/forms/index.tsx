import ContainerPopup from '@/components/ContainerPopup';
import Typography from '@/components/Typography';
import { MoveLeft } from 'lucide-react';
import RolesQ from './steps/RolesQ';
import GeneralQ from './steps/GeneralQ';
import SkillsQ from './steps/SkillsQ';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setStep, setResetData } from '@/lib/redux/slices/formSlice';
import { setResetRoleVacancy } from '@/lib/redux/slices/roleVacancySlice';

export default function Forms({
  onChangeSetPopup,
  className,
}: {
  onChangeSetPopup: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  const formState = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();

  const content = {
    [1]: <RolesQ />,
    [2]: <GeneralQ />,
    [3]: <SkillsQ onChangeSetPopup={onChangeSetPopup} />,
  }[formState.step];
  return (
    // <ContainerPopup className={className}>
    <ContainerPopup className={`${className} overflow-y-auto max-h-screen`}>
      <div className='grid grid-rows-5 w-full'>
        {/* <div className="w-full flex flex-col"> */}
        <section className='px-8 flex items-center '>
          <MoveLeft
            onClick={() => {
              dispatch(setStep({ type: 'Reset' }));
              onChangeSetPopup(false);
              dispatch(setResetRoleVacancy());
              dispatch(setResetData());
            }}
            size={70}
            className='cursor-pointer text-white transition-colors duration-500 hover:text-blue-500'
          />
          <div className='w-10 h-14 mx-auto'></div>
        </section>
        <section className='w-full row-span-4 flex flex-col gap-4 items-center'>
          <Typography variant='h5' color='white'>
            Intern Form Application
          </Typography>
          <div className='flex-1 w-full'>{content}</div>
        </section>
      </div>
    </ContainerPopup>
  );
}
