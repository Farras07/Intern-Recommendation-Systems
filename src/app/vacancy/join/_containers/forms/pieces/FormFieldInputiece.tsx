import Typography, { TypographyVariant } from '@/components/Typography';
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
};
import { Input } from '@/components/ui/input';

export default function FormFieldPiece({
  name,
  inputType,
  control,
  label,
  placeholder,
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
              />
            ) : (
              <Input
                className='bg-white'
                placeholder={placeholder}
                type={inputType}
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
