'use client';

import { Toaster, ToastBar, toast } from 'react-hot-toast';

export default function CustomToaster() {
  return (
    <Toaster position='top-right'>
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {({ icon, message }) => (
            <div
              onClick={() => toast.dismiss(t.id)}
              className='flex items-center gap-2'
            >
              {icon}
              {message}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
