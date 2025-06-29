import React, { useState } from 'react';
import { X, User, Lock, Bell, Palette, Globe, Shield, Save, Eye, EyeOff, Camera, Mail, Phone, MapPin, Calendar, Edit3 } from 'lucide-react';
import { User as UserType } from '../types';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onUpdateUser: (userData: Partial<UserType>) => void;
}

interface UserProfile extends UserType {
  phone?: string;
  location?: string;
  bio?: string;
  birthDate?: string;
  institution?: string;
  department?: string;
  subjects?: string[];
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  assignmentReminders: boolean;
  gradeNotifications: boolean;
  classUpdates: boolean;
  systemUpdates: boolean;
  weeklyReports: boolean;
  marketingEmails: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'contacts';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowMessages: boolean;
  dataSharing: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt' | 'en' | 'es';
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  compactMode: boolean;
  animations: boolean;
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  assignmentReminders: true,
  gradeNotifications: true,
  classUpdates: true,
  systemUpdates: true,
  weeklyReports: false,
  marketingEmails: false
};

const defaultPrivacySettings: PrivacySettings = {
  profileVisibility: 'contacts',
  showEmail: false,
  showPhone: false,
  showLocation: false,
  allowMessages: true,
  dataSharing: false
};

const defaultAppearanceSettings: AppearanceSettings = {
  theme: 'light',
  language: 'pt',
  fontSize: 'medium',
  colorScheme: 'blue',
  compactMode: false,
  animations: true
};

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onUpdateUser 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'privacy' | 'appearance'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState<UserProfile>({
    ...user,
    phone: '',
    location: '',
    bio: '',
    birthDate: '',
    institution: user.role === 'teacher' ? 'Escola Municipal' : 'Escola Municipal',
    department: user.role === 'teacher' ? 'Matemática' : undefined,
    subjects: user.role === 'teacher' ? ['Matemática', 'Física'] : undefined
  });

  // Account state
  const [accountData, setAccountData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: user.email
  });

  // Settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Validate required fields
      const newErrors: Record<string, string> = {};
      
      if (!profileData.name.trim()) {
        newErrors.name = 'Nome é obrigatório';
      }

      if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
        newErrors.email = 'Email inválido';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpdateUser({
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar
      });

      setSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ general: 'Erro ao atualizar perfil. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const newErrors: Record<string, string> = {};

      if (!accountData.currentPassword) {
        newErrors.currentPassword = 'Senha atual é obrigatória';
      }

      if (!accountData.newPassword) {
        newErrors.newPassword = 'Nova senha é obrigatória';
      } else if (accountData.newPassword.length < 6) {
        newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
      }

      if (accountData.newPassword !== accountData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAccountData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        email: accountData.email
      });

      setSuccessMessage('Senha alterada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ general: 'Erro ao alterar senha. Verifique sua senha atual.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSuccessMessage('Configurações de notificação atualizadas!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSuccessMessage('Configurações de privacidade atualizadas!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppearanceUpdate = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSuccessMessage('Configurações de aparência atualizadas!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker or avatar selection modal
    const avatars = [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=150',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150'
    ];
    
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setProfileData(prev => ({ ...prev, avatar: randomAvatar }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'account', label: 'Conta', icon: Lock },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Palette }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Configurações</h2>
                <p className="text-white text-opacity-90">Gerencie suas preferências e dados pessoais</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* User Info */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{profileData.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{user.role === 'teacher' ? 'Professor' : 'Aluno'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{errors.general}</p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Informações do Perfil</h3>
                  <p className="text-gray-600 mb-6">Atualize suas informações pessoais e profissionais.</p>
                </div>

                {/* Avatar Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Foto do Perfil</h4>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <button
                        onClick={handleAvatarChange}
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Alterar foto</p>
                      <p className="text-xs text-gray-600">JPG, PNG ou GIF. Máximo 2MB.</p>
                      <button
                        onClick={handleAvatarChange}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Escolher nova foto
                      </button>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={profileData.birthDate || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localização
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.location || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Cidade, Estado"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900">Informações Profissionais</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instituição
                      </label>
                      <input
                        type="text"
                        value={profileData.institution || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, institution: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nome da escola/universidade"
                      />
                    </div>

                    {user.role === 'teacher' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Departamento
                        </label>
                        <input
                          type="text"
                          value={profileData.department || ''}
                          onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Ex: Matemática, Ciências"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografia
                    </label>
                    <textarea
                      value={profileData.bio || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Conte um pouco sobre você..."
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Configurações da Conta</h3>
                  <p className="text-gray-600 mb-6">Gerencie sua senha e configurações de segurança.</p>
                </div>

                {/* Change Password */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Alterar Senha</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha Atual *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={accountData.currentPassword}
                          onChange={(e) => setAccountData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.currentPassword && <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={accountData.newPassword}
                          onChange={(e) => setAccountData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.newPassword && <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={accountData.confirmPassword}
                          onChange={(e) => setAccountData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handlePasswordChange}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                        <span>{isLoading ? 'Alterando...' : 'Alterar Senha'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-2">Dicas de Segurança</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Use uma senha com pelo menos 8 caracteres</li>
                    <li>• Combine letras maiúsculas, minúsculas, números e símbolos</li>
                    <li>• Não use informações pessoais óbvias</li>
                    <li>• Altere sua senha regularmente</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Configurações de Notificação</h3>
                  <p className="text-gray-600 mb-6">Escolha como e quando você quer receber notificações.</p>
                </div>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Notificações por Email</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Receber emails de notificação', description: 'Ativar/desativar todas as notificações por email' },
                        { key: 'assignmentReminders', label: 'Lembretes de atividades', description: 'Receber lembretes sobre prazos de atividades' },
                        { key: 'gradeNotifications', label: 'Notificações de notas', description: 'Ser notificado quando novas notas estiverem disponíveis' },
                        { key: 'classUpdates', label: 'Atualizações de turma', description: 'Receber atualizações sobre suas turmas' },
                        { key: 'weeklyReports', label: 'Relatórios semanais', description: 'Receber resumo semanal de atividades' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-900">{item.label}</label>
                            <p className="text-xs text-gray-600">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Notificações Push</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'pushNotifications', label: 'Notificações push', description: 'Receber notificações no navegador' },
                        { key: 'systemUpdates', label: 'Atualizações do sistema', description: 'Ser notificado sobre atualizações e manutenções' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-900">{item.label}</label>
                            <p className="text-xs text-gray-600">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNotificationUpdate}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Salvando...' : 'Salvar Configurações'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Configurações de Privacidade</h3>
                  <p className="text-gray-600 mb-6">Controle quem pode ver suas informações e como seus dados são usados.</p>
                </div>

                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Visibilidade do Perfil</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quem pode ver seu perfil?
                        </label>
                        <select
                          value={privacySettings.profileVisibility}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value as any }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="public">Público - Qualquer pessoa</option>
                          <option value="contacts">Contatos - Apenas pessoas da mesma instituição</option>
                          <option value="private">Privado - Apenas você</option>
                        </select>
                      </div>

                      {[
                        { key: 'showEmail', label: 'Mostrar email no perfil' },
                        { key: 'showPhone', label: 'Mostrar telefone no perfil' },
                        { key: 'showLocation', label: 'Mostrar localização no perfil' },
                        { key: 'allowMessages', label: 'Permitir mensagens de outros usuários' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-900">{item.label}</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings[item.key as keyof PrivacySettings] as boolean}
                              onChange={(e) => setPrivacySettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Usage */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Uso de Dados</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-900">Compartilhamento de dados para pesquisa</label>
                          <p className="text-xs text-gray-600">Permitir uso anônimo dos dados para melhorar a plataforma</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.dataSharing}
                            onChange={(e) => setPrivacySettings(prev => ({ ...prev, dataSharing: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handlePrivacyUpdate}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Salvando...' : 'Salvar Configurações'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Configurações de Aparência</h3>
                  <p className="text-gray-600 mb-6">Personalize a aparência da plataforma de acordo com suas preferências.</p>
                </div>

                <div className="space-y-6">
                  {/* Theme */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Tema</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Claro', description: 'Tema claro padrão' },
                        { value: 'dark', label: 'Escuro', description: 'Tema escuro para ambientes com pouca luz' },
                        { value: 'auto', label: 'Automático', description: 'Segue as configurações do sistema' }
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: theme.value as any }))}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            appearanceSettings.theme === theme.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <h5 className="font-medium text-gray-900">{theme.label}</h5>
                          <p className="text-xs text-gray-600 mt-1">{theme.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Idioma</h4>
                    <select
                      value={appearanceSettings.language}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pt">Português (Brasil)</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Tamanho da Fonte</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'small', label: 'Pequena' },
                        { value: 'medium', label: 'Média' },
                        { value: 'large', label: 'Grande' }
                      ].map((size) => (
                        <button
                          key={size.value}
                          onClick={() => setAppearanceSettings(prev => ({ ...prev, fontSize: size.value as any }))}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            appearanceSettings.fontSize === size.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium ${
                            size.value === 'small' ? 'text-sm' :
                            size.value === 'large' ? 'text-lg' : 'text-base'
                          }`}>
                            {size.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Esquema de Cores</h4>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { value: 'blue', label: 'Azul', color: 'bg-blue-500' },
                        { value: 'green', label: 'Verde', color: 'bg-green-500' },
                        { value: 'purple', label: 'Roxo', color: 'bg-purple-500' },
                        { value: 'orange', label: 'Laranja', color: 'bg-orange-500' }
                      ].map((scheme) => (
                        <button
                          key={scheme.value}
                          onClick={() => setAppearanceSettings(prev => ({ ...prev, colorScheme: scheme.value as any }))}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            appearanceSettings.colorScheme === scheme.value
                              ? 'border-gray-800'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 ${scheme.color} rounded-full mx-auto mb-2`}></div>
                          <span className="text-sm font-medium">{scheme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Other Options */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Outras Opções</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'compactMode', label: 'Modo compacto', description: 'Reduzir espaçamentos para mostrar mais conteúdo' },
                        { key: 'animations', label: 'Animações', description: 'Ativar animações e transições suaves' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-900">{item.label}</label>
                            <p className="text-xs text-gray-600">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={appearanceSettings[item.key as keyof AppearanceSettings] as boolean}
                              onChange={(e) => setAppearanceSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAppearanceUpdate}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Salvando...' : 'Salvar Configurações'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};