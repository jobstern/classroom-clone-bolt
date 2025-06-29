import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useInteractionTracking } from '../hooks/useInteractionTracking';
import { CreateClassModal, ClassFormData } from './CreateClassModal';
import { CreateAssignmentModal, AssignmentFormData } from './CreateAssignmentModal';
import { ClassDetailModal } from './ClassDetailModal';
import { GradingModal } from './GradingModal';
import { ReportsModal } from './ReportsModal';
import { TipsConfigModal } from './TipsConfigModal';
import { UserSettingsModal } from './UserSettingsModal';
import { 
  BookOpen, 
  Plus, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Filter,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  Brain,
  Eye,
  Edit3,
  Trash2,
  Download,
  Upload,
  MessageCircle,
  Star,
  User
} from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
  subject: string;
  students: number;
  assignments: number;
  avgGrade: number;
  engagement: number;
  color: string;
  description?: string;
  section?: string;
  room?: string;
  code: string;
  schedule?: string;
  semester?: string;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  classIds: string[];
  avgGrade: number;
  engagement: number;
  lastActive: string;
  totalAssignments: number;
  completedAssignments: number;
}

interface AssignmentData {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  dueDate: string;
  dueTime: string;
  points: number;
  priority: 'low' | 'medium' | 'high';
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  submissions: number;
  totalStudents: number;
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
  graded: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'reminder' | 'system';
  date: string;
  read: boolean;
}

const mockClasses: ClassData[] = [
  {
    id: '1',
    name: 'Matemática - 9º Ano',
    subject: 'Matemática',
    students: 28,
    assignments: 12,
    avgGrade: 8.2,
    engagement: 85,
    color: 'blue',
    description: 'Turma de matemática do 9º ano com foco em álgebra e geometria',
    section: 'A',
    room: '201',
    code: 'MAT9A2025',
    schedule: 'Seg/Qua/Sex 08:00-09:00',
    semester: '2025.1'
  },
  {
    id: '2',
    name: 'Física - 1º Médio',
    subject: 'Física',
    students: 32,
    assignments: 8,
    avgGrade: 7.8,
    engagement: 78,
    color: 'green',
    description: 'Introdução à física com ênfase em mecânica',
    section: 'B',
    room: 'Lab 1',
    code: 'FIS1B2025',
    schedule: 'Ter/Qui 10:00-11:00',
    semester: '2025.1'
  },
  {
    id: '3',
    name: 'Química - 2º Médio',
    subject: 'Química',
    students: 25,
    assignments: 10,
    avgGrade: 8.6,
    engagement: 92,
    color: 'purple',
    description: 'Química orgânica e inorgânica',
    section: 'A',
    room: 'Lab 2',
    code: 'QUI2A2025',
    schedule: 'Seg/Qua 14:00-15:00',
    semester: '2025.1'
  }
];

const mockStudents: StudentData[] = [
  {
    id: '1',
    name: 'João Santos',
    email: 'joao@aluno.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
    classIds: ['1', '2'],
    avgGrade: 8.5,
    engagement: 85,
    lastActive: '2025-01-15T14:30:00Z',
    totalAssignments: 20,
    completedAssignments: 18
  },
  {
    id: '2',
    name: 'Ana Costa',
    email: 'ana@aluno.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    classIds: ['1', '3'],
    avgGrade: 7.2,
    engagement: 72,
    lastActive: '2025-01-14T10:15:00Z',
    totalAssignments: 22,
    completedAssignments: 16
  },
  {
    id: '3',
    name: 'Pedro Silva',
    email: 'pedro@aluno.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=150',
    classIds: ['2', '3'],
    avgGrade: 6.8,
    engagement: 65,
    lastActive: '2025-01-13T16:45:00Z',
    totalAssignments: 18,
    completedAssignments: 12
  },
  {
    id: '4',
    name: 'Maria Oliveira',
    email: 'maria@aluno.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    classIds: ['1', '2', '3'],
    avgGrade: 9.1,
    engagement: 95,
    lastActive: '2025-01-15T18:20:00Z',
    totalAssignments: 30,
    completedAssignments: 29
  }
];

const mockAssignments: AssignmentData[] = [
  {
    id: '1',
    title: 'Resolução de Equações Quadráticas',
    description: 'Exercícios sobre equações do segundo grau',
    classId: '1',
    className: 'Matemática - 9º Ano',
    dueDate: '2025-01-25',
    dueTime: '23:59',
    points: 100,
    priority: 'high',
    type: 'assignment',
    submissions: 22,
    totalStudents: 28,
    status: 'active',
    createdAt: '2025-01-10T09:00:00Z',
    graded: 15
  },
  {
    id: '2',
    title: 'Leis de Newton',
    description: 'Questões sobre as três leis de Newton',
    classId: '2',
    className: 'Física - 1º Médio',
    dueDate: '2025-01-22',
    dueTime: '18:00',
    points: 80,
    priority: 'medium',
    type: 'quiz',
    submissions: 28,
    totalStudents: 32,
    status: 'active',
    createdAt: '2025-01-08T14:00:00Z',
    graded: 28
  },
  {
    id: '3',
    title: 'Projeto de Química Orgânica',
    description: 'Pesquisa sobre compostos orgânicos',
    classId: '3',
    className: 'Química - 2º Médio',
    dueDate: '2025-02-01',
    dueTime: '23:59',
    points: 150,
    priority: 'high',
    type: 'project',
    submissions: 18,
    totalStudents: 25,
    status: 'active',
    createdAt: '2025-01-05T10:00:00Z',
    graded: 8
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nova entrega recebida',
    message: 'João Santos entregou a atividade de Matemática',
    type: 'assignment',
    date: '2025-01-15T14:30:00Z',
    read: false
  },
  {
    id: '2',
    title: 'Prazo próximo',
    message: 'Atividade "Leis de Newton" vence em 2 dias',
    type: 'reminder',
    date: '2025-01-15T09:00:00Z',
    read: false
  },
  {
    id: '3',
    title: 'Atualização do sistema',
    message: 'Nova versão disponível com melhorias',
    type: 'system',
    date: '2025-01-14T16:00:00Z',
    read: true
  }
];

export const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { trackInteraction, startActivity, endActivity } = useInteractionTracking(user?.id || '');
  
  const [classes, setClasses] = useState<ClassData[]>(mockClasses);
  const [students, setStudents] = useState<StudentData[]>(mockStudents);
  const [assignments, setAssignments] = useState<AssignmentData[]>(mockAssignments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [showGrading, setShowGrading] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showTipsConfig, setShowTipsConfig] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentData | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'assignments' | 'students'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    startActivity('teacher-dashboard');
    return () => endActivity();
  }, [startActivity, endActivity]);

  const handleCreateClass = (classData: ClassFormData) => {
    const newClass: ClassData = {
      id: Date.now().toString(),
      name: classData.name,
      subject: classData.subject,
      students: 0,
      assignments: 0,
      avgGrade: 0,
      engagement: 0,
      color: classData.color,
      description: classData.description,
      section: classData.section,
      room: classData.room,
      code: `${classData.subject.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`,
      schedule: '',
      semester: '2025.1'
    };
    
    setClasses(prev => [...prev, newClass]);
    trackInteraction('create', 'class');
  };

  const handleCreateAssignment = (assignmentData: AssignmentFormData) => {
    const selectedClass = classes.find(c => c.id === assignmentData.classId);
    const newAssignment: AssignmentData = {
      id: Date.now().toString(),
      title: assignmentData.title,
      description: assignmentData.description,
      classId: assignmentData.classId,
      className: selectedClass?.name || '',
      dueDate: assignmentData.dueDate,
      dueTime: assignmentData.dueTime,
      points: assignmentData.points,
      priority: assignmentData.priority,
      type: assignmentData.type,
      submissions: 0,
      totalStudents: selectedClass?.students || 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      graded: 0
    };
    
    setAssignments(prev => [...prev, newAssignment]);
    trackInteraction('create', 'assignment');
  };

  const handleClassClick = (classData: ClassData) => {
    setSelectedClass(classData);
    setShowClassDetail(true);
    trackInteraction('view', `class-${classData.id}`);
  };

  const handleGradingClick = (assignment: AssignmentData) => {
    setSelectedAssignment(assignment);
    setShowGrading(true);
    trackInteraction('view', `grading-${assignment.id}`);
  };

  const handleGradeSubmitted = (assignmentId: string, gradedCount: number) => {
    setAssignments(prev => prev.map(a => 
      a.id === assignmentId ? { ...a, graded: gradedCount } : a
    ));
    trackInteraction('grade', `assignment-${assignmentId}`);
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleUpdateUser = (userData: Partial<typeof user>) => {
    // In a real app, this would update the user in the auth context
    console.log('Updating user:', userData);
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
  const totalAssignments = assignments.length;
  const pendingGrading = assignments.reduce((sum, a) => sum + (a.submissions - a.graded), 0);
  const avgClassGrade = classes.length > 0 ? classes.reduce((sum, c) => sum + c.avgGrade, 0) / classes.length : 0;

  // Calculate upcoming deadlines
  const upcomingDeadlines = assignments.filter(a => {
    const dueDate = new Date(`${a.dueDate}T${a.dueTime}`);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">EduPlatform</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTipsConfig(true)}
                className="bg-purple-100 text-purple-600 p-2 rounded-lg hover:bg-purple-200 transition-all"
                title="Configurar Dicas"
              >
                <Brain className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowReports(true)}
                className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-all"
                title="Relatórios"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Nenhuma notificação
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleMarkNotificationRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'assignment' ? 'bg-blue-500' :
                                notification.type === 'grade' ? 'bg-green-500' :
                                notification.type === 'reminder' ? 'bg-orange-500' :
                                'bg-purple-500'
                              }`} />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowUserSettings(true)}
                      className="text-gray-500 hover:text-gray-700 transition-all"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button onClick={logout} className="text-gray-500 hover:text-gray-700">
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo, Prof. {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Você tem {totalStudents} alunos em {classes.length} turmas e {pendingGrading} atividades para corrigir.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Atividades Criadas</p>
                <p className="text-2xl font-bold text-green-600">{totalAssignments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendente Correção</p>
                <p className="text-2xl font-bold text-orange-600">{pendingGrading}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Geral</p>
                <p className="text-2xl font-bold text-purple-600">{avgClassGrade.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setShowCreateClass(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Criar Turma</h3>
                <p className="text-blue-100 text-sm">Adicione uma nova turma</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowCreateAssignment(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Nova Atividade</h3>
                <p className="text-green-100 text-sm">Crie uma atividade</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowReports(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Ver Relatórios</h3>
                <p className="text-purple-100 text-sm">Analytics detalhados</p>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                { id: 'classes', label: 'Turmas', icon: Users },
                { id: 'assignments', label: 'Atividades', icon: FileText },
                { id: 'students', label: 'Alunos', icon: User }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Alerts */}
                {upcomingDeadlines > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <h4 className="font-medium text-orange-900">Prazos Próximos</h4>
                    </div>
                    <p className="text-orange-800 text-sm mt-1">
                      Você tem {upcomingDeadlines} atividades com prazo nos próximos 7 dias.
                    </p>
                  </div>
                )}

                {pendingGrading > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Correções Pendentes</h4>
                    </div>
                    <p className="text-blue-800 text-sm mt-1">
                      {pendingGrading} atividades aguardando correção.
                    </p>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Atividades Recentes</h4>
                    <div className="space-y-3">
                      {assignments.slice(0, 5).map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                            <p className="text-xs text-gray-600">{assignment.className}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {assignment.submissions}/{assignment.totalStudents}
                            </p>
                            <p className="text-xs text-gray-600">entregas</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Turmas com Melhor Desempenho</h4>
                    <div className="space-y-3">
                      {classes
                        .sort((a, b) => b.avgGrade - a.avgGrade)
                        .slice(0, 5)
                        .map((classItem) => (
                          <div key={classItem.id} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{classItem.name}</p>
                              <p className="text-xs text-gray-600">{classItem.students} alunos</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{classItem.avgGrade.toFixed(1)}</p>
                              <p className="text-xs text-gray-600">média</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Classes Tab */}
            {activeTab === 'classes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Suas Turmas</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar turmas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => setShowCreateClass(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Turma</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClasses.map((classItem) => {
                    const colorClasses = {
                      blue: 'bg-blue-500',
                      green: 'bg-green-500',
                      purple: 'bg-purple-500',
                      pink: 'bg-pink-500',
                      orange: 'bg-orange-500',
                      red: 'bg-red-500',
                      yellow: 'bg-yellow-500',
                      indigo: 'bg-indigo-500'
                    };

                    return (
                      <div
                        key={classItem.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleClassClick(classItem)}
                      >
                        <div className={`${colorClasses[classItem.color as keyof typeof colorClasses]} p-4 text-white`}>
                          <h4 className="font-semibold text-lg">{classItem.name}</h4>
                          <p className="text-white text-opacity-90">{classItem.subject}</p>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{classItem.students}</p>
                              <p className="text-xs text-gray-600">Alunos</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{classItem.assignments}</p>
                              <p className="text-xs text-gray-600">Atividades</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Média:</span>
                              <span className="font-medium text-gray-900">{classItem.avgGrade.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Engajamento:</span>
                              <span className="font-medium text-gray-900">{classItem.engagement}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredClasses.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma turma encontrada</h3>
                    <p className="text-gray-600 mb-6">Crie sua primeira turma para começar.</p>
                    <button
                      onClick={() => setShowCreateClass(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
                    >
                      Criar Primeira Turma
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Atividades</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar atividades..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => setShowCreateAssignment(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Atividade</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredAssignments.map((assignment) => {
                    const completionRate = assignment.totalStudents > 0 ? (assignment.submissions / assignment.totalStudents) * 100 : 0;
                    const gradingRate = assignment.submissions > 0 ? (assignment.graded / assignment.submissions) * 100 : 0;
                    
                    return (
                      <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                                assignment.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {assignment.priority === 'high' ? 'Alta' : assignment.priority === 'medium' ? 'Média' : 'Baixa'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                assignment.status === 'active' ? 'bg-green-100 text-green-800' :
                                assignment.status === 'draft' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {assignment.status === 'active' ? 'Ativa' : assignment.status === 'draft' ? 'Rascunho' : 'Fechada'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{assignment.className}</p>
                            <p className="text-sm text-gray-700 mb-4">{assignment.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500">Prazo</p>
                                <p className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(assignment.dueDate).toLocaleDateString('pt-BR')}</span>
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Entregas</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {assignment.submissions}/{assignment.totalStudents}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Corrigidas</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {assignment.graded}/{assignment.submissions}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Pontos</p>
                                <p className="text-sm font-medium text-gray-900">{assignment.points}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>Taxa de Entrega</span>
                                  <span>{completionRate.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${completionRate}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>Taxa de Correção</span>
                                  <span>{gradingRate.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${gradingRate}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-6 flex flex-col space-y-2">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>Ver</span>
                            </button>
                            {assignment.submissions > assignment.graded && (
                              <button 
                                onClick={() => handleGradingClick(assignment)}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all flex items-center space-x-2"
                              >
                                <Award className="w-4 h-4" />
                                <span>Corrigir</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
                    <p className="text-gray-600 mb-6">Crie sua primeira atividade.</p>
                    <button
                      onClick={() => setShowCreateAssignment(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
                    >
                      Criar Primeira Atividade
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Alunos</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar alunos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                      <div className="flex items-start space-x-4">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Média:</span>
                              <span className={`font-medium ${
                                student.avgGrade >= 8 ? 'text-green-600' :
                                student.avgGrade >= 6 ? 'text-orange-600' :
                                'text-red-600'
                              }`}>
                                {student.avgGrade.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Engajamento:</span>
                              <span className="font-medium text-gray-900">{student.engagement}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Atividades:</span>
                              <span className="font-medium text-gray-900">
                                {student.completedAssignments}/{student.totalAssignments}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Último acesso: {new Date(student.lastActive).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm flex items-center justify-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>Ver</span>
                            </button>
                            <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all">
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum aluno encontrado</h3>
                    <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateClass && (
        <CreateClassModal
          isOpen={showCreateClass}
          onClose={() => setShowCreateClass(false)}
          onCreateClass={handleCreateClass}
        />
      )}

      {showCreateAssignment && (
        <CreateAssignmentModal
          isOpen={showCreateAssignment}
          onClose={() => setShowCreateAssignment(false)}
          onCreateAssignment={handleCreateAssignment}
          classes={classes}
        />
      )}

      {showClassDetail && selectedClass && (
        <ClassDetailModal
          classData={selectedClass}
          students={students.filter(s => s.classIds.includes(selectedClass.id))}
          assignments={assignments.filter(a => a.classId === selectedClass.id)}
          onClose={() => {
            setShowClassDetail(false);
            setSelectedClass(null);
          }}
        />
      )}

      {showGrading && selectedAssignment && (
        <GradingModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowGrading(false);
            setSelectedAssignment(null);
          }}
          onGradeSubmitted={handleGradeSubmitted}
        />
      )}

      {showReports && (
        <ReportsModal
          isOpen={showReports}
          onClose={() => setShowReports(false)}
          classes={classes}
        />
      )}

      {showTipsConfig && (
        <TipsConfigModal
          isOpen={showTipsConfig}
          onClose={() => setShowTipsConfig(false)}
          onSaveTipsConfig={(config) => {
            console.log('Tips config saved:', config);
            setShowTipsConfig(false);
          }}
        />
      )}

      {showUserSettings && user && (
        <UserSettingsModal
          isOpen={showUserSettings}
          onClose={() => setShowUserSettings(false)}
          user={user}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
};