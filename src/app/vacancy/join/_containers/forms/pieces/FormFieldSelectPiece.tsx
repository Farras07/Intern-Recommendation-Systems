import Typography, { TypographyVariant } from '@/components/Typography';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { CriteriaOptionsType } from '@/types/CriteriaTypes';

type FormFieldPiece = {
  name: string;
  control: any;
  choices: CriteriaOptionsType[];
  label: {
    sel: string;
    button: string;
  };
  variantTypo?: keyof typeof TypographyVariant;
};

export default function FormFieldSelectPiece({
  name,
  control,
  choices,
  label,
  variantTypo = 'h5',
}: FormFieldPiece) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <Typography
              variant={variantTypo}
              color='blue-sky'
              weight='bold'
              className='mb-2'
            >
              {label.button}
            </Typography>
          </FormLabel>

          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className='w-[15rem]'>
                <SelectValue placeholder={label.button} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label.sel}</SelectLabel>
                  {choices?.map(
                    (choice: CriteriaOptionsType, index: number) => (
                      <SelectItem key={index} value={String(choice.value)}>
                        {choice.label}
                      </SelectItem>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
