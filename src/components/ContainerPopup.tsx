import { cn } from '@/lib/utils';

export default function ContainerPopup({
  className,
  children,
}: {
  className?: string;
  onChangeSetPopup?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        // "w-full h-screen fixed z-50 bg-black top-0"
        'fixed inset-0 bg-black/80',
        className,
      )}
    >
      {children}
    </section>
  );
}
