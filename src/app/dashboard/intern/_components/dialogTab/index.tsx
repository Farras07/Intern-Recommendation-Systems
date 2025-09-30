import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppWindowIcon, CodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import General from './General';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Interview from './Interview';
import Skills from './Skills';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DialogTab({ open, onOpenChange }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>General Settings</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden>
            <DialogDescription>
              Manage general and interview information
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <div className='flex w-full max-w-md max-h-[80vh] flex-col gap-6 overflow-auto'>
          <Tabs defaultValue='account'>
            <TabsList>
              <TabsTrigger value='general'>General</TabsTrigger>
              <TabsTrigger value='skills'>Skills</TabsTrigger>
              <TabsTrigger value='interview'>Interview</TabsTrigger>
            </TabsList>
            <TabsContent value='general'>
              <General onOpenChange={onOpenChange} />
            </TabsContent>
            <TabsContent value='skills'>
              <Skills onOpenChange={onOpenChange} />
            </TabsContent>
            <TabsContent value='interview'>
              <Interview onOpenChange={onOpenChange} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
