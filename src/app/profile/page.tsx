'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useProfileStore } from '@/stores/useProfileStore';
import LoadingPage from '@/components/loading-page';
import {
  User,
  Edit3,
  Save,
  X,
  Bell,
  MessageSquare,
  Calendar,
  Award,
  Package,
  MapPin,
  Phone,
  Mail,
  Shield,
  Settings,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SidebarAd from '@/components/sidebar-ad';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { currentProfile, getProfileById, updateProfile, setCurrentProfile } =
    useProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(currentProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      const profile = getProfileById(session.user.id);
      if (profile) {
        setCurrentProfile(profile);
        setEditedData(profile);
      } else {
        // 기본 프로필 생성 (세션 정보 기반)
        const defaultProfile = {
          id: session.user.id,
          name: session.user.name || '사용자',
          email: session.user.email || '',
          phone: '010-0000-0000',
          birthDate: '1990-01-01',
          gender: 'male' as const,
          address: {
            zipCode: '00000',
            address: '주소를 입력해주세요',
            detailAddress: '',
          },
          preferences: {
            newsletter: true,
            smsMarketing: false,
            pushNotifications: true,
          },
        };
        setCurrentProfile(defaultProfile);
        setEditedData(defaultProfile);
      }
      setIsLoading(false);
    }
  }, [session, getProfileById, setCurrentProfile]);

  if (status === 'loading' || isLoading) {
    return <LoadingPage />;
  }

  if (!session) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <div className='container mx-auto px-4 py-16 text-center'>
          <h2 className='text-2xl font-bold text-gray-600 mb-4'>
            로그인이 필요합니다
          </h2>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSave = () => {
    if (editedData && session?.user?.id) {
      updateProfile(session.user.id, editedData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedData(currentProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleAddressChange = (field: string, value: string) => {
    setEditedData((prev) =>
      prev
        ? {
            ...prev,
            address: { ...prev.address, [field]: value },
          }
        : null
    );
  };

  const handlePreferencesChange = (field: string, value: boolean) => {
    setEditedData((prev) =>
      prev
        ? {
            ...prev,
            preferences: { ...prev.preferences, [field]: value },
          }
        : null
    );
  };

  if (!currentProfile || !editedData) {
    return <LoadingPage />;
  }

  const recentActivities = [
    {
      type: 'order',
      content: '나스티 망고 아이스 외 2개 주문',
      date: '2024-09-01',
      icon: <Package className='h-4 w-4' />,
    },
    {
      type: 'review',
      content: '코스모스 블루베리 리뷰 작성',
      date: '2024-08-28',
      icon: <Award className='h-4 w-4' />,
    },
    {
      type: 'community',
      content: '커뮤니티 게시글 작성',
      date: '2024-08-25',
      icon: <MessageSquare className='h-4 w-4' />,
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
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
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center space-x-4'>
                  <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                    <User className='w-8 h-8 text-green-600' />
                  </div>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                      {currentProfile.name}
                    </h1>
                    <p className='text-gray-500'>{currentProfile.email}</p>
                  </div>
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
                        className='flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
                      >
                        <Save className='w-4 h-4 mr-2' />
                        저장
                      </button>
                      <button
                        onClick={handleCancel}
                        className='flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
                      >
                        <X className='w-4 h-4 mr-2' />
                        취소
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* 기본 정보 */}
              <div className='lg:col-span-2 bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-lg font-semibold mb-4 flex items-center'>
                  <User className='w-5 h-5 mr-2' />
                  기본 정보
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      이름
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={editedData.name}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      />
                    ) : (
                      <p className='text-gray-900'>{currentProfile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      이메일
                    </label>
                    <div className='flex items-center'>
                      <Mail className='w-4 h-4 text-gray-400 mr-2' />
                      <p className='text-gray-900'>{currentProfile.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      전화번호
                    </label>
                    {isEditing ? (
                      <input
                        type='tel'
                        value={editedData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      />
                    ) : (
                      <div className='flex items-center'>
                        <Phone className='w-4 h-4 text-gray-400 mr-2' />
                        <p className='text-gray-900'>{currentProfile.phone}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      생년월일
                    </label>
                    {isEditing ? (
                      <input
                        type='date'
                        value={editedData.birthDate}
                        onChange={(e) =>
                          handleInputChange('birthDate', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      />
                    ) : (
                      <div className='flex items-center'>
                        <Calendar className='w-4 h-4 text-gray-400 mr-2' />
                        <p className='text-gray-900'>
                          {currentProfile.birthDate}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      주소
                    </label>
                    {isEditing ? (
                      <div className='space-y-2'>
                        <input
                          type='text'
                          placeholder='우편번호'
                          value={editedData.address.zipCode}
                          onChange={(e) =>
                            handleAddressChange('zipCode', e.target.value)
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                        />
                        <input
                          type='text'
                          placeholder='기본 주소'
                          value={editedData.address.address}
                          onChange={(e) =>
                            handleAddressChange('address', e.target.value)
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                        />
                        <input
                          type='text'
                          placeholder='상세 주소'
                          value={editedData.address.detailAddress}
                          onChange={(e) =>
                            handleAddressChange('detailAddress', e.target.value)
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                        />
                      </div>
                    ) : (
                      <div className='flex items-start'>
                        <MapPin className='w-4 h-4 text-gray-400 mr-2 mt-1' />
                        <div>
                          <p className='text-gray-900'>
                            ({currentProfile.address.zipCode}){' '}
                            {currentProfile.address.address}
                          </p>
                          {currentProfile.address.detailAddress && (
                            <p className='text-gray-900'>
                              {currentProfile.address.detailAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 알림 설정 */}
                <div className='mt-8'>
                  <h3 className='text-md font-semibold mb-4 flex items-center'>
                    <Bell className='w-5 h-5 mr-2' />
                    알림 설정
                  </h3>

                  <div className='space-y-3'>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={
                          isEditing
                            ? editedData.preferences.newsletter
                            : currentProfile.preferences.newsletter
                        }
                        onChange={(e) =>
                          isEditing &&
                          handlePreferencesChange(
                            'newsletter',
                            e.target.checked
                          )
                        }
                        disabled={!isEditing}
                        className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                      />
                      <span className='ml-2 text-sm text-gray-700'>
                        이메일 뉴스레터
                      </span>
                    </label>

                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={
                          isEditing
                            ? editedData.preferences.smsMarketing
                            : currentProfile.preferences.smsMarketing
                        }
                        onChange={(e) =>
                          isEditing &&
                          handlePreferencesChange(
                            'smsMarketing',
                            e.target.checked
                          )
                        }
                        disabled={!isEditing}
                        className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                      />
                      <span className='ml-2 text-sm text-gray-700'>
                        SMS 마케팅
                      </span>
                    </label>

                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={
                          isEditing
                            ? editedData.preferences.pushNotifications
                            : currentProfile.preferences.pushNotifications
                        }
                        onChange={(e) =>
                          isEditing &&
                          handlePreferencesChange(
                            'pushNotifications',
                            e.target.checked
                          )
                        }
                        disabled={!isEditing}
                        className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                      />
                      <span className='ml-2 text-sm text-gray-700'>
                        푸시 알림
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 최근 활동 */}
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-lg font-semibold mb-4 flex items-center'>
                  <Settings className='w-5 h-5 mr-2' />
                  최근 활동
                </h2>

                <div className='space-y-4'>
                  {recentActivities.map((activity, index) => (
                    <div key={index} className='flex items-start space-x-3'>
                      <div className='flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <div className='text-green-600'>{activity.icon}</div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900'>
                          {activity.content}
                        </p>
                        <p className='text-xs text-gray-500'>{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 보안 설정 */}
                <div className='mt-8 pt-6 border-t border-gray-200'>
                  <h3 className='text-md font-semibold mb-4 flex items-center'>
                    <Shield className='w-5 h-5 mr-2' />
                    보안 설정
                  </h3>

                  <div className='space-y-3'>
                    <button className='w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50'>
                      <div className='text-sm font-medium text-gray-900'>
                        비밀번호 변경
                      </div>
                      <div className='text-xs text-gray-500'>
                        계정 보안을 위해 정기적으로 변경해주세요
                      </div>
                    </button>

                    <button className='w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50'>
                      <div className='text-sm font-medium text-gray-900'>
                        2단계 인증
                      </div>
                      <div className='text-xs text-gray-500'>
                        추가 보안 설정
                      </div>
                    </button>
                  </div>
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
