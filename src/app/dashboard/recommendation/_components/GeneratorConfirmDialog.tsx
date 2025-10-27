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

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFilterExist: boolean;
  generateToggle: (state: boolean) => void;
};

export default function GeneratorConfirmationDialog({
  open,
  onOpenChange,
  isFilterExist,
  generateToggle,
}: DialogProps) {
  const dialogContent = {
    warning: {
      title: 'Recommendation Generator Warning!',
      description: 'You need to filter batch first!',
    },
    confirm: {
      title: 'Recommendation Generator Confirmation',
      description: 'Are You sure want to generate Intern Recommendation?',
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isFilterExist
              ? dialogContent.confirm.title
              : dialogContent.warning.title}
          </DialogTitle>
          <DialogDescription>
            <Typography as='span' variant='c2' color='lightgray'>
              {isFilterExist
                ? dialogContent.confirm.description
                : dialogContent.warning.description}
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
            className={`cursor-pointer ${isFilterExist ? 'flex' : 'hidden'}`}
            onClick={() => {
              generateToggle(true);
              onOpenChange(false);
            }}
          >
            Yessir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
