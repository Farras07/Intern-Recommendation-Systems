import { cn } from '@/lib/utils';
import { Maximize2, ChevronsRightLeft } from 'lucide-react';

type CollapsibleContainerProps = {
  collapsible?: boolean;
  selfIndex: number;
  onClick: () => void;
  activeIndex: number;
  className?: string;
  colSpan?: number | 'full';
  rowSpan?: number | 'full';
  colStart?: number;
  children: React.ReactNode;
};

export default function CollapsibleContainer({
  collapsible = true,
  selfIndex,
  onClick,
  activeIndex,
  className,
  colSpan = 'full',
  rowSpan = 'full',
  colStart = 1,
  children,
}: CollapsibleContainerProps) {
  return (
    <div
      className={cn(
        'bg-white shadow-md rounded-[24px] px-7 pt-3 pb-5 transition-all duration-1000',
        className,
        activeIndex !== 0 && activeIndex != selfIndex && 'hidden',
        activeIndex === selfIndex &&
          collapsible &&
          `col-span-${colSpan} row-span-${rowSpan} col-start-${colStart}`,
      )}
    >
      <div className='relative -top-2 -right-5 flex justify-end'>
        {activeIndex === selfIndex && collapsible ? (
          <div
            className='p-2 rounded-lg hover:bg-light-gray/[10%] hover:shadow-md'
            onClick={onClick}
          >
            <ChevronsRightLeft />
          </div>
        ) : (
          <div
            className={`p-2 rounded-lg hover:bg-light-gray/[10%] hover:shadow-md ${!collapsible && 'hidden'}`}
            onClick={onClick}
          >
            <Maximize2 />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
