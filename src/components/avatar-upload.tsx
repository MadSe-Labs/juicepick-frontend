'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Camera, Upload, X, Loader2, User } from 'lucide-react';
import { updateAvatar, validateImageFile } from '@/lib/avatar-upload';
import toast from 'react-hot-toast';

interface AvatarUploadProps {
  /**
   * 현재 아바타 이미지 URL
   */
  currentAvatarUrl?: string | null;

  /**
   * 사용자 ID
   */
  userId: string;

  /**
   * 업로드 성공 시 콜백
   * @param newAvatarUrl - 새로 업로드된 아바타 URL
   */
  onUploadSuccess: (newAvatarUrl: string) => void;

  /**
   * 업로드 실패 시 콜백
   */
  onUploadError?: (error: Error) => void;

  /**
   * 아바타 크기 (픽셀)
   */
  size?: number;
}

/**
 * 아바타 이미지 업로드 컴포넌트
 *
 * 기능:
 * - 현재 아바타 미리보기
 * - 클릭하여 파일 선택
 * - 드래그 앤 드롭 지원
 * - 로딩 상태 표시
 * - 파일 검증 (크기, 타입)
 */
export default function AvatarUpload({
  currentAvatarUrl,
  userId,
  onUploadSuccess,
  onUploadError,
  size = 120,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 파일 업로드 처리
   */
  const handleFileUpload = async (file: File) => {
    // 파일 검증
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || '파일 검증 실패');
      if (onUploadError) {
        onUploadError(new Error(validation.error));
      }
      return;
    }

    // 로컬 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 업로드 시작
    setUploading(true);

    try {
      // 아바타 업데이트 (기존 삭제 + 새로운 업로드)
      const newAvatarUrl = await updateAvatar(
        file,
        userId,
        currentAvatarUrl || undefined
      );

      // 성공 콜백
      onUploadSuccess(newAvatarUrl);
      toast.success('프로필 사진이 변경되었습니다!');

      // 미리보기 초기화
      setPreviewUrl(null);
    } catch (error: any) {
      console.error('❌ 아바타 업로드 실패:', error);
      toast.error(error.message || '업로드 중 오류가 발생했습니다.');

      // 실패 콜백
      if (onUploadError) {
        onUploadError(error);
      }

      // 미리보기 초기화
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  /**
   * 파일 선택 이벤트 핸들러
   */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await handleFileUpload(file);

    // input 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 업로드 버튼 클릭 핸들러
   */
  const handleClick = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  /**
   * 드래그 오버 핸들러
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  /**
   * 드래그 리브 핸들러
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  /**
   * 드롭 핸들러
   */
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await handleFileUpload(file);
  };

  /**
   * 미리보기 취소 핸들러
   */
  const handleCancelPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 표시할 아바타 URL (미리보기 > 현재 아바타 > 기본 아이콘)
  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className='flex flex-col items-center'>
      {/* 아바타 미리보기 */}
      <div
        className={`relative rounded-full overflow-hidden border-4 transition-all cursor-pointer ${
          dragActive
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-green-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{ width: size, height: size }}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 이미지 표시 */}
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt='프로필 사진'
            fill
            className='object-cover'
            unoptimized // Supabase Storage URL은 외부 도메인이므로
          />
        ) : (
          // 기본 아이콘
          <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
            <User className='w-1/2 h-1/2 text-gray-400' />
          </div>
        )}

        {/* 로딩 오버레이 */}
        {uploading && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
            <Loader2 className='w-8 h-8 text-white animate-spin' />
          </div>
        )}

        {/* 호버 오버레이 */}
        {!uploading && (
          <div className='absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
            <Camera className='w-8 h-8 text-white' />
          </div>
        )}

        {/* 드래그 오버레이 */}
        {dragActive && !uploading && (
          <div className='absolute inset-0 bg-green-500/20 flex items-center justify-center'>
            <Upload className='w-8 h-8 text-green-600' />
          </div>
        )}

        {/* 미리보기 취소 버튼 */}
        {previewUrl && !uploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelPreview();
            }}
            className='absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors'
            title='미리보기 취소'
          >
            <X className='w-4 h-4' />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/jpg,image/png,image/webp'
        onChange={handleFileChange}
        className='hidden'
        disabled={uploading}
      />

      {/* 안내 텍스트 */}
      <div className='mt-3 text-center'>
        <button
          onClick={handleClick}
          disabled={uploading}
          className={`text-sm font-medium transition-colors ${
            uploading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-green-600 hover:text-green-700'
          }`}
        >
          {uploading ? '업로드 중...' : '사진 변경'}
        </button>
        <p className='text-xs text-gray-500 mt-1'>JPG, PNG, WEBP (최대 5MB)</p>
      </div>
    </div>
  );
}
