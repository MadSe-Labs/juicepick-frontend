'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useUpdateProfile } from '@/hooks/useUserProfile';
import LoadingPage from '@/components/loading-page';
import toast from 'react-hot-toast';
import {
  User,
  Edit3,
  Save,
  X,
  Bell,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SidebarAd from '@/components/sidebar-ad';
import AvatarUpload from '@/components/avatar-upload';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { data: profileData, isLoading, error } = useUserProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

  // profileData가 로드되면 editedData 초기화
  useEffect(() => {
    if (profileData) {
      setEditedData({
        phone: profileData.phone || '',
        display_name: profileData.user_profiles?.display_name || '',
        first_name: profileData.user_profiles?.first_name || '',
        last_name: profileData.user_profiles?.last_name || '',
        birth_date: profileData.user_profiles?.birth_date || '',
        gender: profileData.user_profiles?.gender || 'male',
        bio: profileData.user_profiles?.bio || '',
        newsletter_subscribed:
          profileData.user_profiles?.newsletter_subscribed || false,
        sms_marketing_agreed:
          profileData.user_profiles?.sms_marketing_agreed || false,
        push_notifications_enabled:
          profileData.user_profiles?.push_notifications_enabled || true,
      });
    }
  }, [profileData]);

  const handleSave = async () => {
    if (!editedData || !user?.id) return;

    try {
      // 프로필 업데이트
      await updateProfile.mutateAsync(editedData);

      // 성공 토스트
      toast.success('프로필이 성공적으로 수정되었습니다!');

      // 편집 모드 종료
      setIsEditing(false);
    } catch (err: any) {
      console.error('프로필 수정 실패:', err);
      toast.error(err.message || '프로필 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setEditedData({
        phone: profileData.phone || '',
        display_name: profileData.user_profiles?.display_name || '',
        first_name: profileData.user_profiles?.first_name || '',
        last_name: profileData.user_profiles?.last_name || '',
        birth_date: profileData.user_profiles?.birth_date || '',
        gender: profileData.user_profiles?.gender || 'male',
        bio: profileData.user_profiles?.bio || '',
        newsletter_subscribed:
          profileData.user_profiles?.newsletter_subscribed || false,
        sms_marketing_agreed:
          profileData.user_profiles?.sms_marketing_agreed || false,
        push_notifications_enabled:
          profileData.user_profiles?.push_notifications_enabled || true,
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedData((prev: any) => (prev ? { ...prev, [field]: value } : null));
  };

  // 로딩 상태
  if (authLoading || isLoading) {
    return <LoadingPage />;
  }

  // 에러 상태
  if (error) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <main className='container mx-auto px-4 py-8'>
          <div className='text-center'>
            <p className='text-red-500'>
              프로필을 불러오는 중 오류가 발생했습니다.
            </p>
            <p className='text-muted-foreground'>{error.message}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 데이터 없음
  if (!profileData || !editedData) {
    return <LoadingPage />;
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* 광고 영역 */}
          <div className='w-full lg:w-64'>
            <SidebarAd position='left' />
          </div>

          {/* 프로필 메인 콘텐츠 */}
          <div className='flex-1 max-w-4xl'>
            {/* 프로필 헤더 */}
            <div className='bg-card rounded-lg shadow-sm p-6 mb-6'>
              <div className='flex flex-col md:flex-row items-center md:items-start gap-6 mb-6'>
                {/* 아바타 업로드 */}
                <div className='flex-shrink-0'>
                  <AvatarUpload
                    currentAvatarUrl={profileData.user_profiles?.avatar_url}
                    userId={user?.id || ''}
                    onUploadSuccess={async (newAvatarUrl) => {
                      // DB 업데이트
                      await updateProfile.mutateAsync({
                        avatar_url: newAvatarUrl,
                      });
                    }}
                    onDeleteSuccess={async () => {
                      // DB에서 avatar_url을 null로 업데이트
                      await updateProfile.mutateAsync({
                        avatar_url: null,
                      });
                    }}
                    size={120}
                  />
                </div>

                {/* 사용자 정보 및 편집 버튼 */}
                <div className='flex-1 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 w-full'>
                  <div className='text-center md:text-left'>
                    <h1 className='text-2xl font-bold text-foreground'>
                      {profileData.user_profiles?.display_name || '사용자'}
                    </h1>
                    <p className='text-muted-foreground'>{profileData.email}</p>
                  </div>

                  <div className='flex space-x-2'>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className='flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
                      >
                        <Edit3 className='w-4 h-4 mr-2' />
                        편집
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={updateProfile.isPending}
                          className={`flex items-center px-4 py-2 text-white rounded-lg ${
                            updateProfile.isPending
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          <Save className='w-4 h-4 mr-2' />
                          {updateProfile.isPending ? '저장 중...' : '저장'}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={updateProfile.isPending}
                          className='flex items-center px-4 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 disabled:opacity-50'
                        >
                          <X className='w-4 h-4 mr-2' />
                          취소
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className='bg-card rounded-lg shadow-sm p-6'>
              <h2 className='text-lg font-semibold mb-4 flex items-center'>
                <User className='w-5 h-5 mr-2' />
                기본 정보
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* 표시 이름 */}
                <div>
                  <label className='block text-sm font-medium text-foreground mb-1'>
                    표시 이름
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedData.display_name}
                      onChange={(e) =>
                        handleInputChange('display_name', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    />
                  ) : (
                    <p className='text-foreground py-2'>
                      {profileData.user_profiles?.display_name || '-'}
                    </p>
                  )}
                </div>

                {/* 이메일 (읽기 전용) */}
                <div>
                  <label className='block text-sm font-medium text-foreground mb-1'>
                    이메일
                  </label>
                  <div className='flex items-center py-2'>
                    <Mail className='w-4 h-4 text-muted-foreground mr-2' />
                    <p className='text-foreground'>{profileData.email}</p>
                  </div>
                </div>

                {/* 성 */}
                <div>
                  <label className='block text-sm font-medium text-foreground mb-1'>
                    성
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedData.last_name}
                      onChange={(e) =>
                        handleInputChange('last_name', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    />
                  ) : (
                    <p className='text-foreground py-2'>
                      {profileData.user_profiles?.last_name || '-'}
                    </p>
                  )}
                </div>

                {/* 이름 */}
                <div>
                  <label className='block text-sm font-medium text-foreground mb-1'>
                    이름
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedData.first_name}
                      onChange={(e) =>
                        handleInputChange('first_name', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    />
                  ) : (
                    <p className='text-foreground py-2'>
                      {profileData.user_profiles?.first_name || '-'}
                    </p>
                  )}
                </div>

                {/* 전화번호 */}
                <div>
                  <label className='block text-sm font-medium text-foreground mb-1'>
                    전화번호
                  </label>
                  {isEditing ? (
                    <input
                      type='tel'
                      value={editedData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      placeholder='010-0000-0000'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    />
                  ) : (
                    <div className='flex items-center py-2'>
                      <Phone className='w-4 h-4 text-muted-foreground mr-2' />
                      <p className='text-foreground'>
                        {profileData.phone || '-'}
                      </p>
                    </div>
                  )}
                </div>

                {/* 생년월일 */}
                <div>
                  <label className='block text-sm font-medium text-foreground mb-1'>
                    생년월일
                  </label>
                  {isEditing ? (
                    <input
                      type='date'
                      value={editedData.birth_date}
                      onChange={(e) =>
                        handleInputChange('birth_date', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    />
                  ) : (
                    <div className='flex items-center py-2'>
                      <Calendar className='w-4 h-4 text-muted-foreground mr-2' />
                      <p className='text-foreground'>
                        {profileData.user_profiles?.birth_date || '-'}
                      </p>
                    </div>
                  )}
                </div>

                {/* 성별 */}
                <div>
                  <label className='block text-sm font-medium text-foreground mb-1'>
                    성별
                  </label>
                  {isEditing ? (
                    <select
                      value={editedData.gender}
                      onChange={(e) =>
                        handleInputChange('gender', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    >
                      <option value='male'>남성</option>
                      <option value='female'>여성</option>
                      <option value='other'>기타</option>
                    </select>
                  ) : (
                    <p className='text-foreground py-2'>
                      {profileData.user_profiles?.gender === 'male'
                        ? '남성'
                        : profileData.user_profiles?.gender === 'female'
                        ? '여성'
                        : '기타'}
                    </p>
                  )}
                </div>

                {/* 자기소개 */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-foreground mb-1'>
                    자기소개
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      placeholder='자기소개를 입력하세요'
                    />
                  ) : (
                    <p className='text-foreground py-2'>
                      {profileData.user_profiles?.bio || '-'}
                    </p>
                  )}
                </div>
              </div>

              {/* 알림 설정 */}
              <div className='mt-8 pt-6 border-t border-gray-200'>
                <h3 className='text-md font-semibold mb-4 flex items-center'>
                  <Bell className='w-5 h-5 mr-2' />
                  알림 설정
                </h3>

                <div className='space-y-3'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={editedData.newsletter_subscribed}
                      onChange={(e) =>
                        handleInputChange(
                          'newsletter_subscribed',
                          e.target.checked
                        )
                      }
                      disabled={!isEditing}
                      className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                    />
                    <span className='ml-2 text-sm text-foreground'>
                      이메일 뉴스레터
                    </span>
                  </label>

                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={editedData.sms_marketing_agreed}
                      onChange={(e) =>
                        handleInputChange(
                          'sms_marketing_agreed',
                          e.target.checked
                        )
                      }
                      disabled={!isEditing}
                      className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                    />
                    <span className='ml-2 text-sm text-foreground'>
                      SMS 마케팅
                    </span>
                  </label>

                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={editedData.push_notifications_enabled}
                      onChange={(e) =>
                        handleInputChange(
                          'push_notifications_enabled',
                          e.target.checked
                        )
                      }
                      disabled={!isEditing}
                      className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                    />
                    <span className='ml-2 text-sm text-foreground'>
                      푸시 알림
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
