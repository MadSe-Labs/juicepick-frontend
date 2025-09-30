'use client';

interface SupabaseConnectionErrorProps {
  error?: any;
}

/**
 * Supabase 연결 오류를 감지하고 사용자 친화적인 메시지를 표시하는 컴포넌트
 */
export default function SupabaseConnectionError({
  error,
}: SupabaseConnectionErrorProps) {
  // Supabase 연결 오류인지 확인
  const isConnectionError =
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('fetch failed') ||
    error?.message?.includes('NetworkError') ||
    error?.message?.includes('ECONNREFUSED');

  // 연결 오류가 아니면 렌더링하지 않음
  if (!error || !isConnectionError) {
    return null;
  }

  return (
    <div className='bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm mb-6'>
      <div className='flex items-start gap-4'>
        <div className='flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-6 h-6 text-red-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
        </div>
        <div className='flex-1'>
          <h3 className='text-red-800 font-bold text-lg mb-2'>
            🔴 데이터베이스 연결 실패
          </h3>
          <p className='text-red-700 mb-4'>
            Supabase 서버에 연결할 수 없습니다. 로컬 개발 환경이 실행되지 않은
            것 같습니다.
          </p>
          <div className='bg-red-100 p-4 rounded-lg mb-3'>
            <p className='text-red-800 font-semibold mb-2'>💡 해결 방법:</p>
            <ol className='list-decimal list-inside space-y-1 text-red-700 text-sm'>
              <li>Docker Desktop이 실행 중인지 확인하세요</li>
              <li>
                터미널에서 다음 명령어를 실행하세요:
                <code className='ml-2 px-2 py-1 bg-red-200 rounded text-red-900 font-mono text-xs'>
                  supabase start
                </code>
              </li>
              <li>페이지를 새로고침하세요</li>
            </ol>
          </div>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium'
          >
            🔄 새로고침
          </button>
        </div>
      </div>
    </div>
  );
}
