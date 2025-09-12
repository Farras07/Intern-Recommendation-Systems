import { toast, ToastBar, Toaster, ToastOptions } from 'react-hot-toast';
import { FaCheck, FaCheckCircle } from 'react-icons/fa';
import { FaExclamation } from 'react-icons/fa6';
import { HiX } from 'react-icons/hi';

export default function Toast() {
  return (
    <div>
      <Toaster
        position='top-center'
        reverseOrder={true}
        gutter={8}
        toastOptions={{
          style: {
            borderRadius: '8px',
            color: '#8AB364',
          },
        }}
      >
        {t => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <button
                    className='rounded-full p-1 ring-primary-400 transition hover:bg-[#444] focus:outline-none focus-visible:ring'
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <HiX />
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  );
}

const DEFAULT_TOAST: ToastOptions = {
  style: {
    background: '#F0F2F5',
    color: '#9AA2B1',
  },
  icon: <FaCheck size={30} />,
  className: 'w-[375px] [&>div]:justify-start',
  position: 'top-center',
  duration: 3000,
};

const createCustomToast = (options: ToastOptions) => {
  return { DEFAULT_TOAST, ...options };
};

const showToast = (message: string, options: ToastOptions) => {
  return toast(message, options || DEFAULT_TOAST);
};

export { createCustomToast, showToast };

const SUCCESS_TOAST = createCustomToast({
  style: {
    background: '#E8F0E0',
    color: '#8AB364',
  },
  icon: <FaCheckCircle size={30} />,
  className: 'w-[375px] [&>div]:justify-start',
  position: 'top-center',
  duration: 3000,
});

const DANGER_TOAST = createCustomToast({
  style: {
    background: '#F7DBDB',
    color: '#D84A4D',
  },
  icon: <HiX size={30} />,
  className: 'w-[375px] [&>div]:justify-start',
  position: 'top-center',
  duration: 3000,
});

const WARNING_TOAST = createCustomToast({
  style: {
    background: '#FFEFCC',
    color: '#FEB100',
  },
  icon: <FaExclamation size={30} />,
  className: 'w-[375px] [&>div]:justify-start',
  position: 'top-center',
  duration: 3000,
});

export { DANGER_TOAST, SUCCESS_TOAST, WARNING_TOAST };
