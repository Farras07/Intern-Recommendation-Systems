'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Typography from '@/components/Typography';
import { stageOrder } from '@/constant/stages.items';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: string;
  onConfirm: () => void;
};

export default function ShortlistConfirmationDialog({
  open,
  onOpenChange,
  stage,
  onConfirm,
}: DialogProps) {
  const currentStage = stage.replace('_', ' ');
  const currentStageIndex = stageOrder.indexOf(currentStage);
  console.log(currentStageIndex);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Action Confirmation</DialogTitle>
          <DialogDescription>
            <Typography as='span' variant='c2' color='lightgray'>
              Are you sure want to do this, it will update intern data and
              update batch stage to {stageOrder[currentStageIndex + 1]}
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-center gap-4'>
          <Button
            className='cursor-pointer'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className='cursor-pointer bg-green-600 hover:bg-green-700'
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
