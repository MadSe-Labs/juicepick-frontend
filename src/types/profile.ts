type GenderTypes = 'male' | 'female' | 'other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: GenderTypes;
  address: {
    zipCode: string;
    address: string;
    detailAddress: string;
  };
  preferences: {
    newsletter: boolean;
    smsMarketing: boolean;
    pushNotifications: boolean;
  };
}
