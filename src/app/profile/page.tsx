'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LoadingPage from '@/components/loading-page';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  CreditCard,
  Heart,
  MessageSquare,
  Award,
  Settings,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SidebarAd from '@/components/sidebar-ad';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  joinDate: string;
  membershipLevel: string;
  profileImage?: string;
}

// 더미 프로필 데이터
const dummyProfile: UserProfile = {
  name: '김액상',
  email: 'test@juicepick.com',
  phone: '010-1234-5678',
  address: '서울시 강남구 테헤란로 123',
  birthDate: '1990-01-01',
  joinDate: '2024-01-15',
  membershipLevel: 'VIP',
  profileImage: '/placeholder.svg?height=120&width=120',
};

// 더미 통계 데이터
const userStats = [
  {
    icon: <MessageSquare className='h-5 w-5' />,
    label: '작성 리뷰',
    value: '24개',
    color: 'text-blue-600',
  },
  {
    icon: <Heart className='h-5 w-5' />,
    label: '찜한 상품',
    value: '12개',
    color: 'text-red-600',
  },
  {
    icon: <Award className='h-5 w-5' />,
    label: '적립 포인트',
    value: '3,450P',
    color: 'text-yellow-600',
  },
  {
    icon: <CreditCard className='h-5 w-5' />,
    label: '총 주문',
    value: '18회',
    color: 'text-green-600',
  },
];

// 최근 활동 데이터
const recentActivities = [
  {
    type: 'review',
    content: '나스티 쿠션맨 액상 리뷰 작성',
    date: '2024-01-20',
    icon: <MessageSquare className='h-4 w-4' />,
  },
  {
    type: 'wishlist',
    content: '코스모스 블루베리 액상 찜 추가',
    date: '2024-01-18',
    icon: <Heart className='h-4 w-4' />,
  },
  {
    type: 'order',
    content: '맥스웰 민트 액상 주문 완료',
    date: '2024-01-15',
    icon: <CreditCard className='h-4 w-4' />,
  },
  {
    type: 'community',
    content: '커뮤니티 게시글 작성',
    date: '2024-01-12',
    icon: <MessageSquare className='h-4 w-4' />,
  },
];

export default function Profile() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [editedData, setEditedData] = useState<UserProfile>(dummyProfile);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 프로필 데이터 로딩
  useEffect(() => {
    if (session?.user) {
      // 실제로는 API 호출: `/api/profile/${session.user.id}`
      const loadUserProfile = async () => {
        setIsLoading(true);
        try {
          // 임시로 세션 정보에 맞는 더미 데이터 생성
          const userProfile: UserProfile = {
            ...dummyProfile,
            name: session.user.name || '사용자',
            email: session.user.email || '',
          };

          setProfileData(userProfile);
          setEditedData(userProfile);
        } catch (error) {
          console.error('프로필 로딩 실패:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadUserProfile();
    }
  }, [session]);

  // 세션 로딩 중
  if (status === 'loading' || isLoading) {
    return <LoadingPage message='프로필 정보를 불러오는 중입니다...' />;
  }

  // 프로필 데이터가 없는 경우
  if (!profileData) {
    return <LoadingPage message='프로필 정보를 불러오는 중입니다...' />;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editedData });
    setIsEditing(false);
    // 실제로는 API 호출하여 서버에 저장
  };

  const handleCancel = () => {
    setEditedData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const getMembershipBadgeColor = (level: string) => {
    switch (level) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'GOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'SILVER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Left Sidebar */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='left' />

            {/* Profile Menu */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>마이페이지</h3>
              <nav className='space-y-2'>
                <button className='w-full text-left px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium'>
                  프로필
                </button>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  주문 내역
                </button>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  찜한 상품
                </button>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  작성 리뷰
                </button>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  포인트 내역
                </button>
                <button className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors'>
                  알림 설정
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Page Title */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3'>
                <User className='h-8 w-8 text-green-500' />
                프로필
              </h1>
              <p className='text-gray-600'>
                개인정보를 관리하고 계정 설정을 변경할 수 있습니다.
              </p>
            </div>

            {/* Profile Card */}
            <div className='bg-white rounded-lg shadow mb-6'>
              <div className='p-6'>
                <div className='flex items-start justify-between mb-6'>
                  <div className='flex items-center space-x-4'>
                    <div className='relative'>
                      <img
                        src={profileData.profileImage}
                        alt='프로필 사진'
                        className='w-20 h-20 rounded-full object-cover border-4 border-green-100'
                      />
                      <button className='absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors'>
                        <Camera className='h-3 w-3' />
                      </button>
                    </div>
                    <div>
                      <h2 className='text-2xl font-bold text-gray-900'>
                        {profileData.name}
                      </h2>
                      <p className='text-gray-600'>{profileData.email}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getMembershipBadgeColor(
                          profileData.membershipLevel
                        )}`}
                      >
                        {profileData.membershipLevel} 멤버
                      </span>
                    </div>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className='flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer'
                    >
                      <Edit3 className='h-4 w-4' />
                      <span>수정</span>
                    </button>
                  ) : (
                    <div className='flex space-x-2'>
                      <button
                        onClick={handleSave}
                        className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer'
                      >
                        <Save className='h-4 w-4' />
                        <span>저장</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className='flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer'
                      >
                        <X className='h-4 w-4' />
                        <span>취소</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Form */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
                      <User className='h-4 w-4' />
                      <span>이름</span>
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={editedData.name}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      />
                    ) : (
                      <p className='text-gray-900 py-2'>{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
                      <Mail className='h-4 w-4' />
                      <span>이메일</span>
                    </label>
                    <p className='text-gray-900 py-2'>{profileData.email}</p>
                    <p className='text-xs text-gray-500'>
                      이메일은 변경할 수 없습니다.
                    </p>
                  </div>

                  <div>
                    <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
                      <Phone className='h-4 w-4' />
                      <span>연락처</span>
                    </label>
                    {isEditing ? (
                      <input
                        type='tel'
                        value={editedData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      />
                    ) : (
                      <p className='text-gray-900 py-2'>{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
                      <Calendar className='h-4 w-4' />
                      <span>생년월일</span>
                    </label>
                    {isEditing ? (
                      <input
                        type='date'
                        value={editedData.birthDate}
                        onChange={(e) =>
                          handleInputChange('birthDate', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      />
                    ) : (
                      <p className='text-gray-900 py-2'>
                        {profileData.birthDate}
                      </p>
                    )}
                  </div>

                  <div className='md:col-span-2'>
                    <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
                      <MapPin className='h-4 w-4' />
                      <span>주소</span>
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={editedData.address}
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        placeholder='주소를 입력해주세요'
                      />
                    ) : (
                      <p className='text-gray-900 py-2'>
                        {profileData.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className='mt-6 pt-6 border-t border-gray-200'>
                  <div className='flex items-center justify-between text-sm text-gray-600'>
                    <span>가입일: {profileData.joinDate}</span>
                    <span>멤버십 레벨: {profileData.membershipLevel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
              {userStats.map((stat, index) => (
                <div
                  key={index}
                  className='bg-white p-4 rounded-lg shadow text-center'
                >
                  <div
                    className={`inline-flex p-2 rounded-lg ${stat.color
                      .replace('text', 'bg')
                      .replace('600', '100')} mb-2`}
                  >
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stat.value}
                  </p>
                  <p className='text-sm text-gray-600'>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activities */}
            <div className='bg-white rounded-lg shadow'>
              <div className='p-6'>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>
                  최근 활동
                </h3>
                <div className='space-y-4'>
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'
                    >
                      <div className='flex-shrink-0'>
                        <div className='p-2 bg-white rounded-lg border'>
                          {activity.icon}
                        </div>
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-gray-900'>
                          {activity.content}
                        </p>
                        <p className='text-xs text-gray-500'>{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-4 text-center'>
                  <button className='text-sm text-green-600 hover:text-green-700 font-medium'>
                    전체 활동 보기 →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-full lg:w-64 space-y-6'>
            <SidebarAd position='right' />

            {/* Quick Actions */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='font-bold text-lg mb-3'>빠른 설정</h3>
              <div className='space-y-3'>
                <button className='w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left'>
                  <Shield className='h-4 w-4' />
                  <span className='text-sm'>비밀번호 변경</span>
                </button>
                <button className='w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left'>
                  <Bell className='h-4 w-4' />
                  <span className='text-sm'>알림 설정</span>
                </button>
                <button className='w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left'>
                  <Settings className='h-4 w-4' />
                  <span className='text-sm'>계정 설정</span>
                </button>
              </div>
            </div>

            {/* Membership Info */}
            <div className='bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg shadow text-white'>
              <h3 className='font-bold text-lg mb-2'>VIP 멤버 혜택</h3>
              <div className='text-sm space-y-1 text-purple-100'>
                <p>• 무료 배송 서비스</p>
                <p>• 5% 추가 할인</p>
                <p>• 우선 고객 지원</p>
                <p>• 신제품 우선 알림</p>
              </div>
              <button className='mt-3 px-3 py-1 bg-purple-400 bg-opacity-20 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors'>
                혜택 자세히 보기
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
