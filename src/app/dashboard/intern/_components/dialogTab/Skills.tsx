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
import { formUpdateSkillVacancySchema } from '@/constant/schemas.items';
import {
  champion,
  championshipLevel,
  experienceOptions,
  skillProficiency,
} from '@/constant/criteriaValue.items';
import FormFieldSelectPiece from '@/app/vacancy/join/_containers/forms/pieces/FormFieldSelectPiece';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useMutation } from '@/hooks/useQuery.hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Control } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { VacancyRegisType } from '@/types/registDataTypes';
import { useSession } from 'next-auth/react';

type FormSkillValues = z.infer<typeof formUpdateSkillVacancySchema>;

function SkillRateFields({
  control,
  index,
  vacancy,
  disabled,
}: {
  control: Control<FormSkillValues>;
  index: number;
  vacancy: VacancyRegisType[];
  disabled?: any;
}) {
  const { data: session } = useSession();
  if (!session) return;

  const { fields: skillRateFields } = useFieldArray({
    control,
    name: `vacancy.${index}.skills`,
  });

  return (
    <div className='grid gap-3'>
      <Typography
        color='dark'
        variant='t'
        weight='bold'
        className='text-center'
      >
        {vacancy[index]?.role?.title || `Vacancy ${index + 1}`}
      </Typography>

      <div className='flex flex-col gap-2'>
        <FormFieldSelectPiece
          name={`vacancy.${index}.exp`}
          control={control}
          choices={experienceOptions}
          label={{ button: 'Experience', sel: 'Experience' }}
          variantTypo='c2'
          colorTypo={'dark'}
          weightTypo='semibold'
          disabled={disabled}
        />

        <Typography color='dark' variant='c2' weight='semibold'>
          Skills Expertise
        </Typography>

        <div className='flex gap-2 w-full flex-wrap'>
          {skillRateFields.map((skill, skillIndex) => (
            <div key={skill.id} className='gap-4 items-end'>
              <FormFieldSelectPiece
                name={`vacancy.${index}.skills.${skillIndex}.rate`}
                control={control}
                label={{
                  button: `${skill.skillName}`,
                  sel: `${skill.skillName} Expertise Rate`,
                }}
                choices={skillProficiency}
                variantTypo='c2'
                colorTypo={'blue-sky'}
                weightTypo='medium'
                disabled={session.user.role === 'Judge'}
              />
            </div>
          ))}
        </div>

        <div className='flex flex-col gap-3'>
          <Typography color='dark' variant='c2' weight='semibold'>
            Achievement
          </Typography>
          <FormFieldSelectPiece
            name={`vacancy.${index}.achievement.lvlRate`}
            control={control}
            label={{
              button: 'Achievement Level',
              sel: 'Achievement Level',
            }}
            choices={championshipLevel}
            variantTypo='c2'
            colorTypo={'blue-sky'}
            weightTypo='medium'
            disabled={session.user.role === 'Judge'}
          />
          <FormFieldSelectPiece
            name={`vacancy.${index}.achievement.champRate`}
            control={control}
            label={{
              button: 'Achievement Champ Standing',
              sel: 'Achievement Standing',
            }}
            choices={champion}
            variantTypo='c2'
            colorTypo={'blue-sky'}
            weightTypo='medium'
            disabled={session.user.role === 'Judge'}
          />
        </div>
      </div>
    </div>
  );
}

export default function Skills({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { data: session } = useSession();
  if (!session) return;

  const roleVacancyPick = useSelector(
    (state: RootState) => state.registerVacancy.regisData,
  );
  const currentApplyId = useSelector(
    (state: RootState) => state.registerVacancy.currentApplyId,
  );
  const vacancy: VacancyRegisType[] = roleVacancyPick?.vacancy ?? [];

  const { mutate } = useMutation({
    path: `/intern/vacancy/register/${currentApplyId}`,
    queryKey: ['registrationData'],
    method: 'PUT',
    successMessage: 'Update Registration Data Success',
    errorMessage: 'Update Registration Data Failed',
  });

  const formSkillsUpdate = useForm<FormSkillValues>({
    resolver: zodResolver(formUpdateSkillVacancySchema),
    defaultValues: { vacancy: [] },
  });

  console.log(vacancy);

  useEffect(() => {
    if (!vacancy || vacancy.length === 0) return;

    formSkillsUpdate.reset({
      vacancy: vacancy.map(role => ({
        id: role.id,
        exp: role.exp ?? '1',
        skills: role.skills.map(skill => ({
          skillName: skill.skillName,
          rate: skill.rate ?? '1',
        })),
        portofolioLink: role.portfolio?.link ?? '',
        achievement: {
          lvlRate: role.achievement?.lvlRate ?? '1',
          champRate: role.achievement?.champRate ?? '1',
          cert: role.achievement?.cert ?? '',
        },
      })),
    });
  }, [vacancy]);

  const { fields } = useFieldArray({
    control: formSkillsUpdate.control,
    name: 'vacancy',
  });

  const onSubmit = async (
    values: z.infer<typeof formUpdateSkillVacancySchema>,
  ) => {
    const updatedVacancy = values.vacancy.map((vac, index: number) => {
      const { portofolioLink, ...rest } = vac;
      return {
        ...rest,
        interviewRate: vacancy[index].interviewRate,
        lastStage: vacancy[index].lastStage,
        rolePriority: vacancy[index].rolePriority,
        portfolio: {
          link: vac.portofolioLink,
          rate: vacancy[index].portfolio.rate,
        },
      };
    });
    mutate({ vacancy: updatedVacancy });
    onOpenChange(false);
  };

  return (
    <Form {...formSkillsUpdate}>
      <form
        onSubmit={formSkillsUpdate.handleSubmit(onSubmit, errors => {
          console.log('SUBMIT BLOCKED:', errors);
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <Typography variant='h6' weight='bold'>
                Skills
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
            {fields.map((field, index) => (
              <SkillRateFields
                key={field.id}
                control={formSkillsUpdate.control}
                index={index}
                vacancy={vacancy}
                disabled={session.user.role === 'Judge'}
              />
            ))}
          </CardContent>

          <DialogFooter>
            {session?.user?.role === 'Admin' && (
              <CardFooter className='flex justify-center gap-2 p-8'>
                <DialogClose asChild>
                  <Button className='cursor-pointer'>Cancel</Button>
                </DialogClose>
                <Button type='submit' className='cursor-pointer'>
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </DialogFooter>
        </Card>
      </form>
    </Form>
  );
}
