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
import Typography from '@/components/Typography';

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
            {batchdata && batchdata.length > 0 ? (
              batchdata.map((batch, index) => (
                <DropdownMenuRadioItem
                  key={index}
                  value={batch.batchId}
                  onClick={() => setSelectedBatch(batch)}
                >
                  {batch.batchName} - {batch.stage}
                </DropdownMenuRadioItem>
              ))
            ) : (
              <Typography variant='c1'>
                You don&apos;t have active batch
              </Typography>
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
