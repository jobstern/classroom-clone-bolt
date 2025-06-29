import React, { useState } from 'react';
import { X, User, BarChart3, Award, Clock, TrendingUp, Calendar, Eye, MessageCircle, Mail, Target, Brain } from 'lucide-react';

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

interface StudentProgressModalProps {
  student: StudentData;
  onClose: () => void;
}

// Mock data for detailed student progress
const mockStudentDetails = {
  grades: [
    { id: '1', assignment: 'Equações Quadráticas', class: 'Matemática', grade: 8.5, maxGrade: 10, date: '2025-01-15' },
    { id: '2', assignment: 'Leis de Newton', class: 'Física', grade: 9.2, maxGrade: 10, date: '2025-01-12' },
    { id: '3', assignment: 'Tabela Periódica', class: 'Química', grade: 7.8, maxGrade: 10, date: '2025-01-10' },
    { id: '4', assignment: 'Literatura Brasileira', class: 'Português', grade: 8.9, maxGrade: 10, date: '2025-01-08' }
  ],
  studySessions: [
    { id: '1', subject: 'Matemática', duration: 45, date: '2025-01-15', focus: 85 },
    { id: '2', subject: 'Física', duration: 60, date: '2025-01-14', focus: 92 },
    { id: '3', subject: 'Química', duration: 30, date: '2025-01-13', focus: 78 },
    { id: '4', subject: 'Português', duration: 40, date: '2025-01-12', focus: 88 }
  ],
  selfRegulationTips: [
    { id: '1', category: 'Gestão de Tempo', tip: 'Técnica Pomodoro', applied: true, date: '2025-01-15' },
    { id: '2', category: 'Foco', tip: 'Eliminar distrações', applied: true, date: '2025-01-14' },
    { id: '3', category: 'Motivação', tip: 'Definir metas pequenas', applied: false, date: '2025-01-13' },
    { id: '4', category: 'Gestão de Estresse', tip: 'Respiração profunda', applied: true, date: '2025-01-12' }
  ],
  weeklyProgress: [
    { week: 'Sem 1', assignments: 3, completed: 3, avgGrade: 8.5 },
    { week: 'Sem 2', assignments: 4, completed: 4, avgGrade: 8.8 },
    { week: 'Sem 3', assignments: 2, completed: 2, avgGrade: 9.1 },
    { week: 'Sem 4', assignments: 3, completed: 2, avgGrade: 8.2 }
  ]
};

export const StudentProgressModal: React.FC<StudentProgressModalProps> = ({ student, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'grades' | 'study' | 'regulation'>('overview');

  const { grades, studySessions, selfRegulationTips, weeklyProgress } = mockStudentDetails;

  const totalStudyTime = studySessions.reduce((sum, session) => sum + session.duration, 0);
  const avgFocus = studySessions.length > 0 ? studySessions.reduce((sum, session) => sum + session.focus, 0) / studySessions.length : 0;
  const tipsApplied = selfRegulationTips.filter(tip => tip.applied).length;
  const recentGrades = grades.slice(0, 3);

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'text-green-600';
    if (engagement >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 rounded-full border-4 border-white border-opacity-20"
              />
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-white text-opacity-90">{student.email}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span>Média: {student.avgGrade.toFixed(1)}</span>
                  <span>Engajamento: {student.engagement}%</span>
                  <span>Último acesso: {new Date(student.lastActive).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all">
                <Mail className="w-5 h-5" />
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

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'grades', label: 'Notas', icon: Award },
              { id: 'study', label: 'Estudo', icon: Clock },
              { id: 'regulation', label: 'Autorregulação', icon: Brain }
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
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Média Geral</p>
                      <p className="text-3xl font-bold text-blue-700">{student.avgGrade.toFixed(1)}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Engajamento</p>
                      <p className={`text-3xl font-bold ${getEngagementColor(student.engagement)}`}>
                        {student.engagement}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Tempo de Estudo</p>
                      <p className="text-3xl font-bold text-purple-700">{totalStudyTime}h</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Atividades</p>
                      <p className="text-3xl font-bold text-orange-700">
                        {student.completedAssignments}/{student.totalAssignments}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Notas Recentes</h4>
                  <div className="space-y-3">
                    {recentGrades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{grade.assignment}</p>
                          <p className="text-xs text-gray-600">{grade.class}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                            {grade.grade.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-600">{new Date(grade.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Progresso Semanal</h4>
                  <div className="space-y-3">
                    {weeklyProgress.map((week) => (
                      <div key={week.week} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{week.week}</p>
                          <p className="text-xs text-gray-600">
                            {week.completed}/{week.assignments} atividades
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{week.avgGrade.toFixed(1)}</p>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(week.completed / week.assignments) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Indicadores de Desempenho</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Taxa de Conclusão</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${(student.completedAssignments / student.totalAssignments) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round((student.completedAssignments / student.totalAssignments) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Foco Médio</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${avgFocus}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{avgFocus.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Dicas Aplicadas</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-500 h-3 rounded-full"
                          style={{ width: `${(tipsApplied / selfRegulationTips.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {tipsApplied}/{selfRegulationTips.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grades Tab */}
          {activeTab === 'grades' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Notas</h3>
              
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atividade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matéria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {grades.map((grade) => {
                        const percentage = Math.round((grade.grade / grade.maxGrade) * 100);
                        return (
                          <tr key={grade.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{grade.assignment}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{grade.class}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                                {grade.grade.toFixed(1)}/{grade.maxGrade}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                percentage >= 90 ? 'bg-green-100 text-green-800' :
                                percentage >= 70 ? 'bg-blue-100 text-blue-800' :
                                percentage >= 60 ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600 flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(grade.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Distribuição de Notas</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Excelente (9.0-10.0)', count: grades.filter(g => g.grade >= 9).length, color: 'bg-green-500' },
                    { label: 'Bom (7.0-8.9)', count: grades.filter(g => g.grade >= 7 && g.grade < 9).length, color: 'bg-blue-500' },
                    { label: 'Regular (5.0-6.9)', count: grades.filter(g => g.grade >= 5 && g.grade < 7).length, color: 'bg-orange-500' },
                    { label: 'Insuficiente (<5.0)', count: grades.filter(g => g.grade < 5).length, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center space-x-4">
                      <div className="w-32 text-sm text-gray-700">{item.label}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${item.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${grades.length > 0 ? (item.count / grades.length) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="w-8 text-sm font-medium text-gray-900">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Study Tab */}
          {activeTab === 'study' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Sessões de Estudo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-600">Tempo Total</p>
                      <p className="text-2xl font-bold text-blue-700">{totalStudyTime}h</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Target className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-600">Foco Médio</p>
                      <p className="text-2xl font-bold text-green-700">{avgFocus.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-purple-600">Sessões</p>
                      <p className="text-2xl font-bold text-purple-700">{studySessions.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {studySessions.map((session) => (
                  <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{session.subject}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(session.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{session.duration}min</p>
                          <p className="text-xs text-gray-600">Duração</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-lg font-bold ${
                            session.focus >= 80 ? 'text-green-600' :
                            session.focus >= 60 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {session.focus}%
                          </p>
                          <p className="text-xs text-gray-600">Foco</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            session.focus >= 80 ? 'bg-green-500' :
                            session.focus >= 60 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${session.focus}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Self-Regulation Tab */}
          {activeTab === 'regulation' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Autorregulação da Aprendizagem</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-600">Dicas Aplicadas</p>
                      <p className="text-2xl font-bold text-green-700">{tipsApplied}/{selfRegulationTips.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-600">Taxa de Aplicação</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {Math.round((tipsApplied / selfRegulationTips.length) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selfRegulationTips.map((tip) => (
                  <div key={tip.id} className={`border rounded-lg p-6 ${
                    tip.applied ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{tip.tip}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tip.applied ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {tip.applied ? 'Aplicada' : 'Não aplicada'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{tip.category}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(tip.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="ml-4">
                        {tip.applied ? (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Award className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Breakdown */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Dicas por Categoria</h4>
                <div className="space-y-3">
                  {[
                    { category: 'Gestão de Tempo', count: selfRegulationTips.filter(t => t.category === 'Gestão de Tempo').length, applied: selfRegulationTips.filter(t => t.category === 'Gestão de Tempo' && t.applied).length },
                    { category: 'Foco', count: selfRegulationTips.filter(t => t.category === 'Foco').length, applied: selfRegulationTips.filter(t => t.category === 'Foco' && t.applied).length },
                    { category: 'Motivação', count: selfRegulationTips.filter(t => t.category === 'Motivação').length, applied: selfRegulationTips.filter(t => t.category === 'Motivação' && t.applied).length },
                    { category: 'Gestão de Estresse', count: selfRegulationTips.filter(t => t.category === 'Gestão de Estresse').length, applied: selfRegulationTips.filter(t => t.category === 'Gestão de Estresse' && t.applied).length }
                  ].map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{item.category}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${item.count > 0 ? (item.applied / item.count) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">
                          {item.applied}/{item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};