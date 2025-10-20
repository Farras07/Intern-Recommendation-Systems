import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { BatchResponseType } from '@/types/BatchTypes';

export default function Filter({
  batchdata,
  selectedBatch,
  setSelectedBatch,
}: {
  batchdata: BatchResponseType[];
  selectedBatch: BatchResponseType | null;
  setSelectedBatch: (batch: BatchResponseType) => void;
}) {
  return (
    <section className='flex gap-3 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline'>
            Filter Batch:{' '}
            {selectedBatch ? selectedBatch.batchName : 'Select...'}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='w-56' align='start'>
          <DropdownMenuLabel>Choose Batch</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuRadioGroup value={selectedBatch?.batchId}>
            {batchdata?.map((batch, index) =>
              batch.stage === 'Selection 1' || batch.stage === 'Selection 2' ? (
                <DropdownMenuRadioItem
                  key={index}
                  value={batch.batchId}
                  onClick={() => setSelectedBatch(batch)}
                >
                  {batch.batchName} - {batch.stage}
                </DropdownMenuRadioItem>
              ) : null,
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
