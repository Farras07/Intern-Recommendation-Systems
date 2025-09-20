import {
  experienceOptions,
  skillProficiency,
  championshipLevel,
  champion,
} from '@/constant/criteriaValue.items';
import { Form } from '@/components/ui/form';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { formSkillsQVacancySchema } from '@/constant/schemas.items';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import z from 'zod';
import { MoveLeft, MoveRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from '@/lib/redux/slices/formSlice';
import { RootState } from '@/lib/redux/store';
import FormFieldInputPiece from '../pieces/FormFieldInputiece';
import FormFieldDDPiece from '../pieces/FormFieldDDPiece';
import FormFieldSelectPiece from '../pieces/FormFieldSelectPiece';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useMutation } from '@/hooks/useQuery.hooks';
import { showToast, DANGER_TOAST, SUCCESS_TOAST } from '@/components/Toast';

export default function SkillsQ() {
  const dispatch = useDispatch();
  const roleVacancyPick = useSelector(
    (state: RootState) => state.roleVacancyPick.data,
  );
  console.log(roleVacancyPick);
  const formData = useSelector((state: RootState) => state.form.data);

  const { mutate } = useMutation({
    path: '/intern/vacancy/register',
    queryKey: ['register'],
    method: 'POST',
  });

  const formSkillsQ = useForm<z.infer<typeof formSkillsQVacancySchema>>({
    resolver: zodResolver(formSkillsQVacancySchema),
    defaultValues: {
      skills: roleVacancyPick.map(role => ({
        exp: '',
        skillRate: role.skills.map(skill => ({
          skillName: skill.skillName,
          rate: '',
        })),
        portofolioLink: '',
        achievement: {
          lvlRate: '',
          champRate: '',
          cert: '',
        },
      })),
    },
  });

  const { fields } = useFieldArray({
    control: formSkillsQ.control,
    name: 'skills',
  });

  const onSubmit = async (values: z.infer<typeof formSkillsQVacancySchema>) => {
    const newData = roleVacancyPick.map((vacancy, index) => {
      const userData = values.skills[index];

      const mergedSkills = vacancy.skills.map(vacSkill => {
        const userSkill = userData.skillRate.find(
          s => s.skillName === vacSkill.skillName,
        );
        return { ...vacSkill, ...userSkill };
      });

      return {
        ...vacancy,
        batch: vacancy.batch.id,
        role: vacancy.role.id,
        skills: mergedSkills,
        exp: userData.exp,
        portofolioLink: userData.portofolioLink,
        achievement: userData.achievement,
      };
    });

    const flattened = newData.flat();

    mutate(
      { ...formData, vacancy: flattened },
      {
        onSuccess: () => {
          showToast('Intern Register Success', SUCCESS_TOAST);
        },
        onError: err => {
          showToast('Error submitting vacancy', DANGER_TOAST);
          console.error('Error submitting vacancy', err);
        },
      },
    );
  };
  const onBack = () => {
    dispatch(setStep({ type: 'Back' }));
  };

  return (
    <Form {...formSkillsQ}>
      <form
        onSubmit={formSkillsQ.handleSubmit(onSubmit)}
        className='h-auto w-full flex flex-col justify-between'
      >
        <div className='flex flex-1 justify-center px-8 py-6 gap-5'>
          {fields.map((field, index) => {
            const { fields: skillRateFields } = useFieldArray({
              control: formSkillsQ.control,
              name: `skills.${index}.skillRate`,
            });
            const [hideAchievement, setHideAchievement] = useState(false);
            const [hideChamp, setHideChamp] = useState(false);
            return (
              <div
                key={field.id}
                className='bg-lightgray/20 rounded-[3rem] flex flex-col flex-1 p-7 gap-6'
              >
                <Typography
                  color='white'
                  variant='h5'
                  weight='semibold'
                  className='text-center'
                >
                  {roleVacancyPick[index]?.role?.title ||
                    `Vacancy ${index + 1}`}
                </Typography>
                <div className='flex flex-col gap-2'>
                  <Typography color='blue-sky' variant='p' weight='semibold'>
                    Experience
                  </Typography>
                  <FormFieldDDPiece
                    name={`skills.${index}.exp`}
                    control={formSkillsQ.control}
                    choices={experienceOptions}
                    label={{ button: 'Choose Experience', dd: 'Experience' }}
                  />
                </div>

                <Typography color='white' variant='h6' weight='semibold'>
                  Skills Expertise
                </Typography>
                <div className='flex gap-5'>
                  {skillRateFields.map((skill, skillIndex) => {
                    return (
                      <div key={skill.id} className='gap-4 items-end'>
                        <Typography
                          color='blue-sky'
                          variant='p'
                          weight='semibold'
                          className='mb-2'
                        >
                          {skill.skillName}
                        </Typography>
                        <FormFieldDDPiece
                          name={`skills.${index}.skillRate.${skillIndex}.rate`}
                          control={formSkillsQ.control}
                          label={{
                            button: 'Expertise Rate',
                            dd: `${skill.skillName} Expertise Rate`,
                          }}
                          choices={skillProficiency}
                        />
                      </div>
                    );
                  })}
                </div>
                <FormFieldInputPiece
                  name={`skills.${index}.portofolioLink`}
                  control={formSkillsQ.control}
                  inputType={'url'}
                  placeholder={'Type Your Portofolio Link Drive (PDF)'}
                  label={'Portofolio Link'}
                  variantTypo={'p'}
                />
                <div className='flex flex-col gap-6 bg-lightgray/40 rounded-[3rem] p-7'>
                  <div className='flex justify-center space-x-2'>
                    <Switch
                      checked={hideAchievement}
                      onCheckedChange={setHideAchievement}
                    />
                    <Label
                      htmlFor='achievement-check'
                      className='text-typo-blue-sky'
                    >
                      I Have Field Related Achievement
                    </Label>
                  </div>
                  <div
                    className={`${hideAchievement ? 'flex' : 'hidden'} flex-col gap-6`}
                  >
                    <FormFieldSelectPiece
                      name={`skills.${index}.achievement.lvlRate`}
                      control={formSkillsQ.control}
                      label={{
                        button: 'Select Achievement Level',
                        sel: 'Achievement Level',
                      }}
                      choices={championshipLevel}
                      variantTypo='p'
                    />
                    <div className='flex justify-center space-x-2'>
                      <Switch
                        checked={hideChamp}
                        onCheckedChange={setHideChamp}
                      />
                      <Label
                        htmlFor='achievementChamp-check'
                        className='text-typo-blue-sky'
                      >
                        I&apos;m a Champ On That Achievement
                      </Label>
                    </div>
                    <div className={`${hideChamp ? 'flex' : 'hidden'}`}>
                      <FormFieldSelectPiece
                        name={`skills.${index}.achievement.champRate`}
                        control={formSkillsQ.control}
                        label={{
                          button: 'Select Achievement Champ Standing',
                          sel: 'Achievement Standing',
                        }}
                        choices={champion}
                        variantTypo='p'
                      />
                    </div>
                    <FormFieldInputPiece
                      name={`skills.${index}.achievement.cert`}
                      control={formSkillsQ.control}
                      inputType={'url'}
                      placeholder={'Type your Certificate link drive (PDF)'}
                      label={'Skill Related Certificate'}
                      variantTypo={'p'}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className='flex justify-center gap-8 p-8'>
          <Button
            variant={'hero-card'}
            type='button'
            className='cursor-pointer hover:bg-amber-300 flex items-center gap-2'
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
            className='cursor-pointer hover:bg-amber-300 flex items-center gap-2'
          >
            <Typography color='dark' weight='semibold'>
              Submit
            </Typography>
            <MoveRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}
