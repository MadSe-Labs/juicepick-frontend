import { Loader2 } from 'lucide-react';

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({
  message = '페이지를 로딩 중입니다...',
}: LoadingPageProps) {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='h-8 w-8 animate-spin text-green-500 mx-auto mb-4' />
        <p className='text-gray-600'>{message}</p>
      </div>
    </div>
  );
}
