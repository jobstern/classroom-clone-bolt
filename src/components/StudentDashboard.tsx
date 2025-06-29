import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useInteractionTracking } from '../hooks/useInteractionTracking';
import { useSelfRegulation } from '../hooks/useSelfRegulation';
import { SelfRegulationPopup } from './SelfRegulationPopup';
import { AssignmentDetailModal } from './AssignmentDetailModal';
import { GradeHistoryModal } from './GradeHistoryModal';
import { StudyTimerModal } from './StudyTimerModal';
import { ResourceLibraryModal } from './ResourceLibraryModal';
import { UserSettingsModal } from './UserSettingsModal';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  Bell,
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  BarChart3,
  Target,
  Timer,
  Award,
  TrendingUp,
  User,
  Settings,
  Search,
  Filter,
  Star,
  MessageCircle,
  Video,
  Headphones,
  Image,
  PlusCircle,
  Eye,
  Upload,
  Send
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  class: string;
  classId: string;
  dueDate: string;
  dueTime: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  grade?: number;
  description: string;
  instructions: string;
  priority: 'high' | 'medium' | 'low';
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  points: number;
  attachments: string[];
  submissionText?: string;
  submissionAttachments?: string[];
  feedback?: string;
  submittedAt?: string;
}

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
  focus: number;
  notes: string;
}

interface Grade {
  id: string;
  assignmentTitle: string;
  className: string;
  grade: number;
  maxPoints: number;
  date: string;
  feedback: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'reminder' | 'tip';
  date: string;
  read: boolean;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Resolução de Equações Quadráticas',
    class: 'Matemática - 9º Ano',
    classId: '1',
    dueDate: '2025-01-20',
    dueTime: '23:59',
    status: 'pending',
    description: 'Resolva os exercícios 1-15 da página 87',
    instructions: 'Complete todos os exercícios mostrando o desenvolvimento completo. Use a fórmula de Bhaskara quando necessário.',
    priority: 'high',
    type: 'assignment',
    points: 100,
    attachments: ['exercicios_quadraticas.pdf', 'formula_bhaskara.png']
  },
  {
    id: '2',
    title: 'Relatório de Experimento',
    class: 'Física - 1º Médio',
    classId: '2',
    dueDate: '2025-01-25',
    dueTime: '14:30',
    status: 'submitted',
    description: 'Descreva o experimento sobre movimento uniformemente variado',
    instructions: 'O relatório deve conter: introdução, metodologia, resultados, discussão e conclusão.',
    priority: 'medium',
    type: 'project',
    points: 80,
    attachments: ['roteiro_experimento.pdf'],
    submissionText: 'Relatório completo sobre o experimento de MUV...',
    submittedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '3',
    title: 'Tabela Periódica',
    class: 'Química - 2º Médio',
    classId: '3',
    dueDate: '2025-01-18',
    dueTime: '16:00',
    status: 'graded',
    grade: 92,
    description: 'Memorize os primeiros 20 elementos da tabela periódica',
    instructions: 'Quiz sobre símbolos, números atômicos e propriedades dos elementos.',
    priority: 'low',
    type: 'quiz',
    points: 100,
    attachments: [],
    feedback: 'Excelente trabalho! Demonstrou domínio completo do conteúdo.',
    submittedAt: '2025-01-17T15:45:00Z'
  },
  {
    id: '4',
    title: 'Ensaio sobre Literatura Brasileira',
    class: 'Português - 2º Médio',
    classId: '4',
    dueDate: '2025-01-16',
    dueTime: '23:59',
    status: 'late',
    description: 'Análise crítica de obra do Romantismo',
    instructions: 'Ensaio de 3-5 páginas analisando características do Romantismo em obra escolhida.',
    priority: 'high',
    type: 'assignment',
    points: 120,
    attachments: ['obras_romantismo.pdf']
  }
];

const mockStudySessions: StudySession[] = [
  {
    id: '1',
    subject: 'Matemática',
    duration: 45,
    date: '2025-01-15',
    focus: 85,
    notes: 'Estudei equações quadráticas'
  },
  {
    id: '2',
    subject: 'Física',
    duration: 60,
    date: '2025-01-14',
    focus: 78,
    notes: 'Revisão de cinemática'
  }
];

const mockGrades: Grade[] = [
  {
    id: '1',
    assignmentTitle: 'Tabela Periódica',
    className: 'Química - 2º Médio',
    grade: 92,
    maxPoints: 100,
    date: '2025-01-18',
    feedback: 'Excelente trabalho!'
  },
  {
    id: '2',
    assignmentTitle: 'Prova de Álgebra',
    className: 'Matemática - 9º Ano',
    grade: 85,
    maxPoints: 100,
    date: '2025-01-10',
    feedback: 'Bom desempenho, mas pode melhorar na resolução de problemas.'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nova atividade disponível',
    message: 'Resolução de Equações Quadráticas foi adicionada',
    type: 'assignment',
    date: '2025-01-15T09:00:00Z',
    read: false
  },
  {
    id: '2',
    title: 'Nota disponível',
    message: 'Sua nota para Tabela Periódica: 9.2',
    type: 'grade',
    date: '2025-01-14T16:30:00Z',
    read: false
  }
];

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { interactions, trackInteraction, startActivity, endActivity } = useInteractionTracking(user?.id || '');
  const { currentTip, showTip, dismissTip } = useSelfRegulation(user?.id || '', interactions);
  
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [studySessions, setStudySessions] = useState<StudySession[]>(mockStudySessions);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showGradeHistory, setShowGradeHistory] = useState(false);
  const [showStudyTimer, setShowStudyTimer] = useState(false);
  const [showResourceLibrary, setShowResourceLibrary] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'assignments' | 'grades' | 'progress' | 'resources'>('assignments');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    startActivity('dashboard');
    return () => endActivity();
  }, [startActivity, endActivity]);

  const handleAssignmentClick = (assignment: Assignment) => {
    trackInteraction('click', `assignment-${assignment.id}`);
    setSelectedAssignment(assignment);
  };

  const handleSubmitAssignment = (assignmentId: string, submissionData: { text: string; attachments: string[] }) => {
    trackInteraction('submit', `assignment-${assignmentId}`);
    setAssignments(prev => prev.map(a => 
      a.id === assignmentId 
        ? { 
            ...a, 
            status: 'submitted' as const,
            submissionText: submissionData.text,
            submissionAttachments: submissionData.attachments,
            submittedAt: new Date().toISOString()
          }
        : a
    ));
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

  const filteredAssignments = assignments.filter(assignment => {
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.class.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-orange-500 bg-orange-50',
    low: 'border-green-500 bg-green-50'
  };

  const statusIcons = {
    pending: <Clock className="w-5 h-5 text-orange-500" />,
    submitted: <CheckCircle className="w-5 h-5 text-blue-500" />,
    graded: <CheckCircle className="w-5 h-5 text-green-500" />,
    late: <AlertCircle className="w-5 h-5 text-red-500" />
  };

  const typeIcons = {
    assignment: <FileText className="w-4 h-4" />,
    quiz: <Clock className="w-4 h-4" />,
    project: <Target className="w-4 h-4" />,
    exam: <AlertCircle className="w-4 h-4" />
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const averageGrade = grades.length > 0 ? grades.reduce((sum, g) => sum + (g.grade / g.maxPoints * 100), 0) / grades.length : 0;
  const totalStudyTime = studySessions.reduce((sum, s) => sum + s.duration, 0);

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
                onClick={() => setShowStudyTimer(true)}
                className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-all"
                title="Timer de Estudo"
              >
                <Timer className="w-5 h-5" />
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
                <div className="relative group">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    onClick={() => setShowUserSettings(true)}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <Settings className="w-3 h-3" />
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <button onClick={logout} className="text-gray-500 hover:text-gray-700">
                    Sair
                  </button>
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
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Você tem {pendingAssignments} atividades pendentes e média geral de {averageGrade.toFixed(1)}.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Atividades Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingAssignments}</p>
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
                <p className="text-2xl font-bold text-green-600">{averageGrade.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo de Estudo</p>
                <p className="text-2xl font-bold text-blue-600">{totalStudyTime}h</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engajamento</p>
                <p className="text-2xl font-bold text-purple-600">85%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'assignments', label: 'Atividades', icon: FileText },
                { id: 'grades', label: 'Notas', icon: Award },
                { id: 'progress', label: 'Progresso', icon: BarChart3 },
                { id: 'resources', label: 'Recursos', icon: BookOpen }
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
            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar atividades..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Todas</option>
                      <option value="pending">Pendentes</option>
                      <option value="submitted">Entregues</option>
                      <option value="graded">Avaliadas</option>
                    </select>
                  </div>
                </div>

                {/* Assignments List */}
                <div className="space-y-4">
                  {filteredAssignments.map((assignment) => (
                    <div 
                      key={assignment.id} 
                      className={`border-l-4 ${priorityColors[assignment.priority]} p-4 rounded-lg cursor-pointer hover:shadow-md transition-all`}
                      onClick={() => handleAssignmentClick(assignment)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {statusIcons[assignment.status]}
                            {typeIcons[assignment.type]}
                            <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                            {assignment.status === 'late' && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                Atrasado
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{assignment.class}</p>
                          <p className="text-sm text-gray-700 mb-3">{assignment.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Prazo: {new Date(assignment.dueDate).toLocaleDateString('pt-BR')} às {assignment.dueTime}</span>
                              <span>{assignment.points} pontos</span>
                              {assignment.attachments.length > 0 && (
                                <span className="flex items-center space-x-1">
                                  <FileText className="w-3 h-3" />
                                  <span>{assignment.attachments.length} anexos</span>
                                </span>
                              )}
                            </div>
                            {assignment.status === 'graded' && assignment.grade && (
                              <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full font-medium">
                                Nota: {assignment.grade}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          {assignment.status === 'pending' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignmentClick(assignment);
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
                            >
                              Entregar
                            </button>
                          )}
                          {assignment.status === 'submitted' && (
                            <span className="text-blue-600 text-sm font-medium">Entregue</span>
                          )}
                          {assignment.status === 'graded' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignmentClick(assignment);
                              }}
                              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-sm"
                            >
                              Ver Feedback
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredAssignments.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
                      <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Grades Tab */}
            {activeTab === 'grades' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Histórico de Notas</h3>
                  <button
                    onClick={() => setShowGradeHistory(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Ver Relatório Completo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grades.map((grade) => (
                    <div key={grade.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{grade.assignmentTitle}</h4>
                        <span className={`text-lg font-bold ${
                          (grade.grade / grade.maxPoints) >= 0.9 ? 'text-green-600' :
                          (grade.grade / grade.maxPoints) >= 0.7 ? 'text-blue-600' :
                          (grade.grade / grade.maxPoints) >= 0.6 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {grade.grade}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{grade.className}</p>
                      <p className="text-sm text-gray-700 mb-3">{grade.feedback}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(grade.date).toLocaleDateString('pt-BR')}</span>
                        <span>{Math.round((grade.grade / grade.maxPoints) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {grades.length === 0 && (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma nota disponível</h3>
                    <p className="text-gray-600">Suas notas aparecerão aqui após a correção das atividades.</p>
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Seu Progresso</h3>

                {/* Study Sessions */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Sessões de Estudo</h4>
                    <button
                      onClick={() => setShowStudyTimer(true)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2 text-sm"
                    >
                      <Timer className="w-4 h-4" />
                      <span>Iniciar Sessão</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {studySessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">{session.subject}</h5>
                          <p className="text-sm text-gray-600">{session.notes}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{session.duration}min</p>
                          <p className="text-sm text-gray-600">Foco: {session.focus}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Desempenho por Matéria</h4>
                  <div className="space-y-4">
                    {[
                      { subject: 'Matemática', grade: 85, color: 'bg-blue-500' },
                      { subject: 'Física', grade: 78, color: 'bg-green-500' },
                      { subject: 'Química', grade: 92, color: 'bg-purple-500' },
                      { subject: 'Português', grade: 88, color: 'bg-orange-500' }
                    ].map((item) => (
                      <div key={item.subject} className="flex items-center space-x-4">
                        <div className="w-20 text-sm font-medium text-gray-700">{item.subject}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className={`${item.color} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${item.grade}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm font-medium text-gray-900">{item.grade}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recursos de Aprendizagem</h3>
                  <button
                    onClick={() => setShowResourceLibrary(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Biblioteca Completa</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Videoaulas',
                      description: 'Aulas gravadas e explicações detalhadas',
                      icon: Video,
                      color: 'bg-red-500',
                      count: '24 vídeos'
                    },
                    {
                      title: 'Materiais de Apoio',
                      description: 'PDFs, apresentações e resumos',
                      icon: FileText,
                      color: 'bg-blue-500',
                      count: '18 arquivos'
                    },
                    {
                      title: 'Exercícios Extras',
                      description: 'Atividades para praticar',
                      icon: Target,
                      color: 'bg-green-500',
                      count: '32 exercícios'
                    },
                    {
                      title: 'Podcasts',
                      description: 'Conteúdo em áudio para estudar',
                      icon: Headphones,
                      color: 'bg-purple-500',
                      count: '12 episódios'
                    },
                    {
                      title: 'Infográficos',
                      description: 'Resumos visuais dos conteúdos',
                      icon: Image,
                      color: 'bg-orange-500',
                      count: '8 infográficos'
                    },
                    {
                      title: 'Simulados',
                      description: 'Testes para avaliar conhecimento',
                      icon: CheckCircle,
                      color: 'bg-indigo-500',
                      count: '6 simulados'
                    }
                  ].map((resource) => (
                    <div 
                      key={resource.title}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => trackInteraction('click', `resource-${resource.title.toLowerCase()}`)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 ${resource.color} rounded-lg flex items-center justify-center`}>
                          <resource.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{resource.title}</h4>
                          <p className="text-sm text-gray-600">{resource.count}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{resource.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedAssignment && (
        <AssignmentDetailModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          onSubmit={handleSubmitAssignment}
        />
      )}

      {showGradeHistory && (
        <GradeHistoryModal
          grades={grades}
          onClose={() => setShowGradeHistory(false)}
        />
      )}

      {showStudyTimer && (
        <StudyTimerModal
          onClose={() => setShowStudyTimer(false)}
          onSaveSession={(session) => {
            setStudySessions(prev => [...prev, session]);
            setShowStudyTimer(false);
          }}
        />
      )}

      {showResourceLibrary && (
        <ResourceLibraryModal
          onClose={() => setShowResourceLibrary(false)}
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

      {/* Self-Regulation Popup */}
      {showTip && currentTip && (
        <SelfRegulationPopup
          tip={currentTip}
          onDismiss={dismissTip}
        />
      )}
    </div>
  );
};