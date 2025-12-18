import Typography, {
  TypographyVariant,
  TypographyColor,
  FontWeight,
} from '@/components/Typography';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type FormFieldPiece = {
  name: string;
  inputType: string;
  control: any;
  placeholder?: string;
  label: string;
  variantTypo?: keyof typeof TypographyVariant;
  colorTypo?: keyof typeof TypographyColor;
  weightTypo?: keyof typeof FontWeight;
  disabled?: any;
};
import { Input } from '@/components/ui/input';

export default function FormFieldPiece({
  name,
  inputType,
  control,
  label,
  placeholder,
  variantTypo = 'h5',
  colorTypo = 'blue-sky',
  weightTypo = 'bold',
  disabled,
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
              color={colorTypo}
              weight={weightTypo}
              className='mb-2'
            >
              {label}
            </Typography>
          </FormLabel>
          <FormControl>
            {inputType === 'file' ? (
              <Input
                className='bg-white'
                placeholder={placeholder}
                type='file'
                accept='.pdf'
                {...field}
                value={undefined}
                onChange={e => field.onChange(e.target.files?.[0] || null)}
                disabled={disabled}
              />
            ) : (
              <Input
                className='bg-white'
                placeholder={placeholder}
                type={inputType}
                disabled={disabled}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
