'use client';
import Layout from '@/layouts/dashboard/LayoutContainer';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import Typography from '@/components/Typography';
import Filter from './_components/Filter';
import { useQuery } from '@/hooks/useQuery.hooks';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { BatchResponseType } from '@/types/BatchTypes';
import Loading from '@/app/Loading';
import { DANGER_TOAST, showToast } from '@/components/Toast';
import GeneratorConfirmationDialog from './_components/GeneratorConfirmDialog';
import { RecommendationType } from '@/types/RecommendationTypes';
import DTRecommendation from './_components/DTRecommendation';
import { columnsRecommendationsData } from '@/constant/table/recommendation.columns';
import ShortlistDialog from './_components/ShotlistDialog';
import { useDispatch } from 'react-redux';
import { setShortlistCandidate } from '@/lib/redux/slices/shortlistSlice';
import InvariantError from '@/exceptions/InvariantError';
import { useSession } from 'next-auth/react';
import NotFoundError from '@/exceptions/NotFoundError';

export default function Recommendation() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { data, isLoading } = useQuery({
    path: '/intern/batch',
    queryKey: ['batch'],
  });

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);
  const [isShortlistDialogOpen, setIsShortlistDialogOpen] =
    useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchResponseType | null>(
    null,
  );

  const [generateToggle, setGenerateToggle] = useState<boolean>(false);
  const [alternative, setAlternative] = useState<RecommendationType | []>([]);
  const [matrixLabels, setMatrixLabels] = useState<string[]>([]);
  const [alternativeLoading, setAlternativeLoading] = useState<boolean>(false);

  const stage = selectedBatch?.stage?.replace(/\s+/g, '_') || '';
  const {
    data: recommendationData,
    isLoading: isRecommendationLoading,
    error,
  } = useQuery({
    path: selectedBatch
      ? `/recommendation?batchId=${selectedBatch.batchId}&stage=${stage}`
      : '',
    queryKey: [
      'recommendation',
      selectedBatch ? selectedBatch.batchId : 'none',
    ],
    enabledVar: generateToggle && !!selectedBatch,
  });

  console.log(recommendationData);

  const handleGenerate = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen);
  };

  console.log(recommendationData);

  const handlePickRole = (alt: any) => {
    setAlternativeLoading(true);
    const formatted = alt?.map((item: any) => {
      const matrixObj = item.matrixLabel.reduce(
        (acc: Record<string, number>, label: string, idx: number) => {
          acc[label] = item.matrix[idx];
          return acc;
        },
        {},
      );
      return { ...item, ...matrixObj };
    });
    setAlternative(formatted || []);
    if (alt?.length > 0) {
      setMatrixLabels(alt[0].matrixLabel);
    }
    setAlternativeLoading(false);
  };

  const handleShortlist = () => {
    try {
      if (!selectedBatch?.batchName)
        throw new InvariantError('Generate Recommendation First!');
      dispatch(
        setShortlistCandidate({
          batch: selectedBatch?.batchName,
          recommendation: recommendationData,
        }),
      );
      setIsShortlistDialogOpen(true);
    } catch (error) {
      if (error instanceof InvariantError)
        showToast(error.message, DANGER_TOAST);
    }
  };

  useEffect(() => {
    if (error instanceof NotFoundError) {
      showToast('There are no registration data in this batch!', DANGER_TOAST);
    }
  }, [error]);

  return (
    <Layout>
      <CollapsibleContainer
        collapsible={false}
        selfIndex={1}
        activeIndex={1}
        className='col-span-4 row-span-7 p-9'
      >
        <div className='flex gap-5 items-center justify-between'>
          <Typography variant='h5' weight='semibold'>
            Recommendation
          </Typography>
          <Filter
            batchdata={!isLoading ? (data?.batches ?? []) : []}
            selectedBatch={selectedBatch}
            setSelectedBatch={setSelectedBatch}
          />
        </div>

        <section
          className={`h-[90%] flex flex-col gap-4 ${recommendationData ?? 'justify-center items-center'}`}
        >
          {recommendationData ? (
            <>
              <Typography variant='h6' color='dark'>
                {selectedBatch ? selectedBatch.batchName : ''}
              </Typography>
              <Typography variant='p' color='blue-sky' className='-mt-4'>
                {selectedBatch ? selectedBatch.stage : ''}
              </Typography>
              <section className='flex flex-col gap-5 items-center'>
                <Typography weight='semibold' variant='h6'>
                  PICK ROLE:
                </Typography>
                <div className='flex gap-5 justify-center'>
                  {Array.isArray(recommendationData) &&
                    recommendationData.map((item, index: number) => (
                      <Button
                        key={index}
                        className='cursor-pointer focus:bg-gray focus:text-typo-white'
                        variant={'outline-black'}
                        onClick={() => {
                          handlePickRole(item.rank);
                        }}
                      >
                        {item.role}
                      </Button>
                    ))}
                </div>
              </section>
              <section>
                <DTRecommendation
                  columns={columnsRecommendationsData(matrixLabels)}
                  data={Array.isArray(alternative) ? alternative : []}
                  isLoading={alternativeLoading}
                  className={{ parent: 'max-h-[38vh]' }}
                />
              </section>
              {session?.user?.role === 'Admin' &&
                (selectedBatch?.stage === 'Selection 1' ||
                  selectedBatch?.stage === 'Selection 2') && (
                  <section className='flex justify-center'>
                    <Button
                      variant='hero-card'
                      className='cursor-pointer'
                      onClick={handleShortlist}
                    >
                      Shortlist Candidates
                    </Button>
                  </section>
                )}
            </>
          ) : (
            <>
              <div
                className={`flex-col gap-5 items-center ${isRecommendationLoading ? 'hidden' : 'flex'}`}
              >
                <Image
                  src='/icons/generate.svg'
                  width={300}
                  height={300}
                  alt=''
                />
                <Typography color='lightgray' variant='c2'>
                  Click Generate Recommendation Button to Generate
                  Recommendation
                </Typography>
                <Button
                  className='w-fit cursor-pointer'
                  onClick={handleGenerate}
                >
                  Generate Recommendation
                </Button>
              </div>
              <div
                className={`flex-col gap-5 items-center ${!isRecommendationLoading ? 'hidden' : 'flex'}`}
              >
                <Loading />
                <Typography color='lightgray' variant='c2'>
                  Wait a minute!. Generating Intern Recomendation...
                </Typography>
              </div>
            </>
          )}
        </section>
      </CollapsibleContainer>
      <GeneratorConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        isFilterExist={selectedBatch ? true : false}
        generateToggle={setGenerateToggle}
      />

      <ShortlistDialog
        open={isShortlistDialogOpen}
        onOpenChange={setIsShortlistDialogOpen}
        stage={selectedBatch?.stage}
        currentBatch={selectedBatch}
      />
    </Layout>
  );
}
