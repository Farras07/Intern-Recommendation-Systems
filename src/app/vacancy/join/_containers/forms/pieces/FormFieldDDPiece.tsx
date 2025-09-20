import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { CriteriaOptionsType } from '@/types/CriteriaTypes';
import { useState } from 'react';

type FormFieldPiece = {
  name: string;
  control: any;
  choices: CriteriaOptionsType[];
  label: {
    dd: string;
    button: string;
  };
};

export default function FormDropdownFieldPiece({
  name,
  control,
  choices,
  label,
}: FormFieldPiece) {
  const [chosenDDItem, setChosenDDItem] = useState<string>('');
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  {chosenDDItem || label.button}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{label.dd}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {choices?.map(
                    (choice: CriteriaOptionsType, index: number) => (
                      <DropdownMenuRadioItem
                        key={index}
                        value={String(choice.value)}
                        onClick={() => setChosenDDItem(choice.label)}
                      >
                        {choice.label}
                      </DropdownMenuRadioItem>
                    ),
                  )}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
