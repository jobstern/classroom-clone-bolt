import React, { useState, useMemo } from 'react';
import { X, BarChart3, Users, Target, Clock, TrendingUp, Download, Filter, Calendar, Eye, Brain, BookOpen, Award, AlertTriangle } from 'lucide-react';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Array<{ id: string; name: string; color: string; students: number }>;
}

interface StudentAnalytics {
  id: string;
  name: string;
  avatar: string;
  totalTimeSpent: number;
  activitiesCompleted: number;
  activitiesTotal: number;
  averageGrade: number;
  engagementScore: number;
  tipsViewed: number;
  tipsApplied: number;
  lastActive: string;
  riskLevel: 'low' | 'medium' | 'high';
  improvementAreas: string[];
}

interface ClassAnalytics {
  classId: string;
  className: string;
  totalStudents: number;
  activeStudents: number;
  averageEngagement: number;
  averageGrade: number;
  completionRate: number;
  tipsDelivered: number;
  tipsEffectiveness: number;
  commonStruggles: string[];
}

const mockStudentData: StudentAnalytics[] = [
  {
    id: '1',
    name: 'João Santos',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
    totalTimeSpent: 12600000, // 3.5 hours in ms
    activitiesCompleted: 8,
    activitiesTotal: 12,
    averageGrade: 8.5,
    engagementScore: 85,
    tipsViewed: 15,
    tipsApplied: 12,
    lastActive: '2025-01-15T14:30:00Z',
    riskLevel: 'low',
    improvementAreas: ['Gestão de Tempo']
  },
  {
    id: '2',
    name: 'Ana Costa',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    totalTimeSpent: 8400000, // 2.3 hours
    activitiesCompleted: 5,
    activitiesTotal: 12,
    averageGrade: 6.8,
    engagementScore: 62,
    tipsViewed: 8,
    tipsApplied: 4,
    lastActive: '2025-01-14T10:15:00Z',
    riskLevel: 'medium',
    improvementAreas: ['Foco', 'Motivação']
  },
  {
    id: '3',
    name: 'Pedro Silva',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=150',
    totalTimeSpent: 4200000, // 1.2 hours
    activitiesCompleted: 3,
    activitiesTotal: 12,
    averageGrade: 5.2,
    engagementScore: 35,
    tipsViewed: 3,
    tipsApplied: 1,
    lastActive: '2025-01-12T16:45:00Z',
    riskLevel: 'high',
    improvementAreas: ['Engajamento', 'Gestão de Estresse', 'Motivação']
  },
  {
    id: '4',
    name: 'Maria Oliveira',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    totalTimeSpent: 15600000, // 4.3 hours
    activitiesCompleted: 11,
    activitiesTotal: 12,
    averageGrade: 9.2,
    engagementScore: 95,
    tipsViewed: 20,
    tipsApplied: 18,
    lastActive: '2025-01-15T18:20:00Z',
    riskLevel: 'low',
    improvementAreas: []
  }
];

const mockClassData: ClassAnalytics[] = [
  {
    classId: '1',
    className: 'Matemática - 9º Ano',
    totalStudents: 28,
    activeStudents: 24,
    averageEngagement: 78,
    averageGrade: 7.8,
    completionRate: 85,
    tipsDelivered: 156,
    tipsEffectiveness: 72,
    commonStruggles: ['Gestão de Tempo', 'Foco em Exercícios']
  },
  {
    classId: '2',
    className: 'Física - 1º Médio',
    totalStudents: 32,
    activeStudents: 28,
    averageEngagement: 82,
    averageGrade: 8.1,
    completionRate: 78,
    tipsDelivered: 189,
    tipsEffectiveness: 68,
    commonStruggles: ['Compreensão de Conceitos', 'Motivação']
  },
  {
    classId: '3',
    className: 'Química - 2º Médio',
    totalStudents: 25,
    activeStudents: 23,
    averageEngagement: 88,
    averageGrade: 8.6,
    completionRate: 92,
    tipsDelivered: 134,
    tipsEffectiveness: 85,
    commonStruggles: ['Memorização', 'Gestão de Estresse']
  }
];

const reportTabs = [
  { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
  { id: 'students', label: 'Alunos', icon: Users },
  { id: 'classes', label: 'Turmas', icon: BookOpen },
  { id: 'self-regulation', label: 'Autorregulação', icon: Brain },
  { id: 'performance', label: 'Desempenho', icon: Award }
];

const riskLevelColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
};

const riskLevelLabels = {
  low: 'Baixo Risco',
  medium: 'Risco Médio',
  high: 'Alto Risco'
};

export const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose, classes }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [dateRange, setDateRange] = useState('30');

  const filteredStudents = useMemo(() => {
    if (selectedClass === 'all') return mockStudentData;
    return mockStudentData.filter(student => {
      // In a real app, you'd filter by actual class membership
      return true;
    });
  }, [selectedClass]);

  const overallStats = useMemo(() => {
    const totalStudents = filteredStudents.length;
    const activeStudents = filteredStudents.filter(s => 
      new Date(s.lastActive).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;
    
    const avgEngagement = filteredStudents.reduce((sum, s) => sum + s.engagementScore, 0) / totalStudents;
    const avgGrade = filteredStudents.reduce((sum, s) => sum + s.averageGrade, 0) / totalStudents;
    const totalTipsViewed = filteredStudents.reduce((sum, s) => sum + s.tipsViewed, 0);
    const totalTipsApplied = filteredStudents.reduce((sum, s) => sum + s.tipsApplied, 0);
    const tipsEffectiveness = totalTipsViewed > 0 ? (totalTipsApplied / totalTipsViewed) * 100 : 0;
    
    const riskDistribution = {
      low: filteredStudents.filter(s => s.riskLevel === 'low').length,
      medium: filteredStudents.filter(s => s.riskLevel === 'medium').length,
      high: filteredStudents.filter(s => s.riskLevel === 'high').length
    };

    return {
      totalStudents,
      activeStudents,
      avgEngagement: Math.round(avgEngagement),
      avgGrade: Math.round(avgGrade * 10) / 10,
      totalTipsViewed,
      totalTipsApplied,
      tipsEffectiveness: Math.round(tipsEffectiveness),
      riskDistribution
    };
  }, [filteredStudents]);

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    console.log('Exporting report...');
  };

  if (!isOpen) return null;

  const ActiveTabIcon = reportTabs.find(tab => tab.id === activeTab)?.icon || BarChart3;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Relatórios e Analytics</h2>
                <p className="text-white text-opacity-90">Insights sobre aprendizagem e autorregulação</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportReport}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            {/* Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Filtros</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Turma</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todas as Turmas</option>
                    {classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Período</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7">Últimos 7 dias</option>
                    <option value="30">Últimos 30 dias</option>
                    <option value="90">Últimos 3 meses</option>
                    <option value="365">Último ano</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-1">
              {reportTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Tab Header */}
              <div className="flex items-center space-x-3 mb-6">
                <ActiveTabIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {reportTabs.find(tab => tab.id === activeTab)?.label}
                </h3>
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Alunos Ativos</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {overallStats.activeStudents}/{overallStats.totalStudents}
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Engajamento Médio</p>
                          <p className="text-2xl font-bold text-gray-900">{overallStats.avgEngagement}%</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Nota Média</p>
                          <p className="text-2xl font-bold text-gray-900">{overallStats.avgGrade}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Eficácia das Dicas</p>
                          <p className="text-2xl font-bold text-gray-900">{overallStats.tipsEffectiveness}%</p>
                        </div>
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Distribution */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Risco</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold text-green-600">{overallStats.riskDistribution.low}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Baixo Risco</p>
                        <p className="text-xs text-gray-500">Alunos engajados</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold text-yellow-600">{overallStats.riskDistribution.medium}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Risco Médio</p>
                        <p className="text-xs text-gray-500">Precisam de atenção</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold text-red-600">{overallStats.riskDistribution.high}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Alto Risco</p>
                        <p className="text-xs text-gray-500">Intervenção urgente</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Maria Oliveira completou atividade de Matemática</p>
                          <p className="text-xs text-gray-500">15 minutos atrás</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">João Santos visualizou dica de gestão de tempo</p>
                          <p className="text-xs text-gray-500">32 minutos atrás</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Ana Costa precisa de atenção - baixo engajamento</p>
                          <p className="text-xs text-gray-500">1 hora atrás</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Students Tab */}
              {activeTab === 'students' && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900">Análise Individual dos Alunos</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo Estudo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atividades</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Média</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engajamento</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dicas</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risco</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atividade</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img className="h-8 w-8 rounded-full" src={student.avatar} alt={student.name} />
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatTime(student.totalTimeSpent)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.activitiesCompleted}/{student.activitiesTotal}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.averageGrade.toFixed(1)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${student.engagementScore}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-900">{student.engagementScore}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.tipsApplied}/{student.tipsViewed}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${riskLevelColors[student.riskLevel]}`}>
                                  {riskLevelLabels[student.riskLevel]}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(student.lastActive)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Student Details Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredStudents.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium').map((student) => (
                      <div key={student.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <img className="h-10 w-10 rounded-full" src={student.avatar} alt={student.name} />
                            <div>
                              <h5 className="font-semibold text-gray-900">{student.name}</h5>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${riskLevelColors[student.riskLevel]}`}>
                                {riskLevelLabels[student.riskLevel]}
                              </span>
                            </div>
                          </div>
                          <AlertTriangle className={`w-5 h-5 ${student.riskLevel === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progresso das Atividades:</span>
                            <span className="font-medium">{Math.round((student.activitiesCompleted / student.activitiesTotal) * 100)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Eficácia das Dicas:</span>
                            <span className="font-medium">{Math.round((student.tipsApplied / student.tipsViewed) * 100)}%</span>
                          </div>
                          
                          {student.improvementAreas.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Áreas de Melhoria:</p>
                              <div className="flex flex-wrap gap-1">
                                {student.improvementAreas.map((area, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes Tab */}
              {activeTab === 'classes' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mockClassData.map((classData) => (
                      <div key={classData.classId} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">{classData.className}</h5>
                            <p className="text-sm text-gray-600">{classData.totalStudents} alunos</p>
                          </div>
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{classData.averageEngagement}%</p>
                              <p className="text-xs text-gray-600">Engajamento</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{classData.averageGrade}</p>
                              <p className="text-xs text-gray-600">Nota Média</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Alunos Ativos:</span>
                              <span className="font-medium">{classData.activeStudents}/{classData.totalStudents}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Taxa de Conclusão:</span>
                              <span className="font-medium">{classData.completionRate}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Dicas Entregues:</span>
                              <span className="font-medium">{classData.tipsDelivered}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Eficácia das Dicas:</span>
                              <span className="font-medium">{classData.tipsEffectiveness}%</span>
                            </div>
                          </div>

                          {classData.commonStruggles.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Dificuldades Comuns:</p>
                              <div className="flex flex-wrap gap-1">
                                {classData.commonStruggles.map((struggle, index) => (
                                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                    {struggle}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Self-Regulation Tab */}
              {activeTab === 'self-regulation' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Dicas Entregues</p>
                          <p className="text-2xl font-bold text-gray-900">{overallStats.totalTipsViewed}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Dicas Aplicadas</p>
                          <p className="text-2xl font-bold text-gray-900">{overallStats.totalTipsApplied}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Taxa de Eficácia</p>
                          <p className="text-2xl font-bold text-gray-900">{overallStats.tipsEffectiveness}%</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                          <p className="text-2xl font-bold text-gray-900">2.8h</p>
                        </div>
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips Effectiveness by Category */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Eficácia por Categoria de Dica</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Gestão de Tempo</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-10">78%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Foco</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-10">65%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Gestão de Estresse</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-10">82%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Motivação</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-10">71%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Most Effective Tips */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Dicas Mais Eficazes</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Técnica Pomodoro</p>
                          <p className="text-sm text-gray-600">Gestão de Tempo</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">85%</p>
                          <p className="text-xs text-gray-500">aplicação</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Respiração Profunda</p>
                          <p className="text-sm text-gray-600">Gestão de Estresse</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">82%</p>
                          <p className="text-xs text-gray-500">aplicação</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Definir Metas Pequenas</p>
                          <p className="text-sm text-gray-600">Motivação</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-purple-600">79%</p>
                          <p className="text-xs text-gray-500">aplicação</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Notas</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">9.0 - 10.0</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">25%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">8.0 - 8.9</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">35%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">7.0 - 7.9</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">25%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{'< 7.0'}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">15%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Taxa de Conclusão</h4>
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 relative">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeDasharray="78, 100"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-900">78%</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Atividades concluídas no prazo</p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Tempo Médio por Atividade</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tarefas</span>
                          <span className="text-sm font-medium text-gray-900">45 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Quizzes</span>
                          <span className="text-sm font-medium text-gray-900">15 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Projetos</span>
                          <span className="text-sm font-medium text-gray-900">2.5h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Provas</span>
                          <span className="text-sm font-medium text-gray-900">1.2h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Trends */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Tendências de Desempenho</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Melhores Performers</h5>
                        <div className="space-y-2">
                          {filteredStudents
                            .sort((a, b) => b.averageGrade - a.averageGrade)
                            .slice(0, 3)
                            .map((student, index) => (
                              <div key={student.id} className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                                }`}>
                                  {index + 1}
                                </div>
                                <img className="h-6 w-6 rounded-full" src={student.avatar} alt={student.name} />
                                <span className="text-sm font-medium text-gray-900 flex-1">{student.name}</span>
                                <span className="text-sm font-bold text-gray-900">{student.averageGrade.toFixed(1)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Maior Engajamento</h5>
                        <div className="space-y-2">
                          {filteredStudents
                            .sort((a, b) => b.engagementScore - a.engagementScore)
                            .slice(0, 3)
                            .map((student, index) => (
                              <div key={student.id} className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                                }`}>
                                  {index + 1}
                                </div>
                                <img className="h-6 w-6 rounded-full" src={student.avatar} alt={student.name} />
                                <span className="text-sm font-medium text-gray-900 flex-1">{student.name}</span>
                                <span className="text-sm font-bold text-gray-900">{student.engagementScore}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};