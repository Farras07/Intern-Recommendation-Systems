import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { NotebookPen, Funnel, MessagesSquare, BadgeCheck } from 'lucide-react';
import { useMutation } from '@/hooks/useQuery.hooks';
import _Fetch from '@/hooks/request.hooks';

export default function PieceStages({
  batchId,
  stage,
}: {
  batchId: string;
  stage: string;
}) {
  const stageOrder = [
    'Registration',
    'Selection 1',
    'Interview',
    'Selection 2',
    'Finish',
  ];
  const currentIndex = stageOrder.indexOf(stage);

  const stagesIcon = [
    { name: 'Registration', icon: <NotebookPen size={40} /> },
    { name: 'Selection 1', icon: <Funnel size={40} /> },
    { name: 'Interview', icon: <MessagesSquare size={40} /> },
    { name: 'Selection 2', icon: <Funnel size={40} /> },
    { name: 'Finish', icon: <BadgeCheck size={40} /> },
  ].map(s => ({
    ...s,
    link: `/dashboard/intern?batchId=${batchId}&stage=${s.name}`,
  }));

  const { mutate } = useMutation({
    path: `/intern/batch/${batchId}`,
    queryKey: ['batchActive'],
    method: 'PUT',
  });

  const onSubmit = async () => {
    if (stage == 'Registration') {
      const regisData = await _Fetch(
        `/intern/vacancy/register?batchId=${batchId}`,
        'GET',
      );
      regisData.map(async data => {
        const vacancy = data.vacancy.map(vac => {
          vac.lastStage = stageOrder[currentIndex + 1];
          return vac;
        });
        await _Fetch(`/intern/vacancy/register/${data.id}`, 'PUT', { vacancy });
      });
    }
    mutate({ stage: stageOrder[currentIndex + 1] });
  };
  return (
    <section className='w-full h-full flex flex-col gap-2 mt-2'>
      <section className='flex gap-7'>
        <div className='w-fit border-b-4 border-b-black p-2'>
          <Typography weight='semibold'>{batchId}</Typography>
        </div>
        <Button className='cursor-pointer' onClick={onSubmit}>
          Update to Next Stage
        </Button>
      </section>
      <div className='flex justify-center items-center gap-2'>
        {stagesIcon.map((stage, index) => {
          let bgColor = 'hover:bg-gray-200'; // default (future)
          if (index < currentIndex) bgColor = 'bg-green-500 hover:bg-green-700'; // passed
          if (index === currentIndex) bgColor = 'bg-light-blue hover:bg-sky'; // current

          return (
            <div key={index} className='flex items-center gap-2 '>
              <a
                href={index <= currentIndex ? stage.link : '#'}
                onClick={e => {
                  if (index > currentIndex) {
                    e.preventDefault(); // prevent navigation if it's a future stage
                  }
                }}
                className='w-28 flex flex-col items-center gap-3 cursor-pointer'
              >
                <div
                  className={`w-fit h-fit p-3 rounded-full shadow-md ${bgColor}`}
                >
                  {stage.icon}
                </div>
                <Typography
                  variant='p'
                  weight='semibold'
                  className='text-center'
                >
                  {stage.name}
                </Typography>
              </a>
              {index + 1 !== stagesIcon.length && (
                <div className='w-14 h-2 rounded-2xl bg-black'></div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
