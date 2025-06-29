import React, { useState } from 'react';
import { X, Users, FileText, BarChart3, Settings, Plus, Eye, Award, Calendar, Clock, TrendingUp, MessageCircle, Mail, Phone } from 'lucide-react';

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

interface ClassDetailModalProps {
  classData: ClassData;
  students: StudentData[];
  assignments: AssignmentData[];
  onClose: () => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({ 
  classData, 
  students, 
  assignments, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments' | 'analytics'>('overview');

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

  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissions, 0);
  const totalPossibleSubmissions = assignments.reduce((sum, a) => sum + a.totalStudents, 0);
  const submissionRate = totalPossibleSubmissions > 0 ? (totalSubmissions / totalPossibleSubmissions) * 100 : 0;
  const activeStudents = students.filter(s => {
    const lastActive = new Date(s.lastActive);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastActive > weekAgo;
  }).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className={`${colorClasses[classData.color as keyof typeof colorClasses]} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{classData.name}</h2>
                  <p className="text-white text-opacity-90">{classData.subject}</p>
                </div>
              </div>
              {classData.description && (
                <p className="text-white text-opacity-80 text-sm mb-3">{classData.description}</p>
              )}
              <div className="flex items-center space-x-6 text-sm">
                {classData.section && <span>Turma: {classData.section}</span>}
                {classData.room && <span>Sala: {classData.room}</span>}
                {classData.schedule && <span>Horário: {classData.schedule}</span>}
                <span>Código: {classData.code}</span>
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

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'students', label: 'Alunos', icon: Users },
              { id: 'assignments', label: 'Atividades', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
                      <p className="text-sm font-medium text-blue-600">Total de Alunos</p>
                      <p className="text-3xl font-bold text-blue-700">{students.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Alunos Ativos</p>
                      <p className="text-3xl font-bold text-green-700">{activeStudents}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Atividades</p>
                      <p className="text-3xl font-bold text-purple-700">{assignments.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Taxa de Entrega</p>
                      <p className="text-3xl font-bold text-orange-700">{submissionRate.toFixed(0)}%</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Atividades Recentes</h4>
                  <div className="space-y-3">
                    {assignments.slice(0, 5).map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                          <p className="text-xs text-gray-600">
                            Prazo: {new Date(assignment.dueDate).toLocaleDateString('pt-BR')}
                          </p>
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
                  <h4 className="font-medium text-gray-900 mb-4">Top Performers</h4>
                  <div className="space-y-3">
                    {students
                      .sort((a, b) => b.avgGrade - a.avgGrade)
                      .slice(0, 5)
                      .map((student, index) => (
                        <div key={student.id} className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-600">Média: {student.avgGrade.toFixed(1)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Alunos da Turma</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Aluno</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
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
                          <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {students.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum aluno matriculado</h3>
                  <p className="text-gray-600 mb-6">Adicione alunos à turma para começar.</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all">
                    Adicionar Primeiro Aluno
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Atividades da Turma</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nova Atividade</span>
                </button>
              </div>

              <div className="space-y-4">
                {assignments.map((assignment) => {
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
                            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all flex items-center space-x-2">
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

              {assignments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade criada</h3>
                  <p className="text-gray-600 mb-6">Crie a primeira atividade para esta turma.</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all">
                    Criar Primeira Atividade
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Analytics da Turma</h3>
              
              {/* Performance Distribution */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Distribuição de Desempenho</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Excelente (9.0-10.0)', count: students.filter(s => s.avgGrade >= 9).length, color: 'bg-green-500' },
                    { label: 'Bom (7.0-8.9)', count: students.filter(s => s.avgGrade >= 7 && s.avgGrade < 9).length, color: 'bg-blue-500' },
                    { label: 'Regular (5.0-6.9)', count: students.filter(s => s.avgGrade >= 5 && s.avgGrade < 7).length, color: 'bg-orange-500' },
                    { label: 'Insuficiente (<5.0)', count: students.filter(s => s.avgGrade < 5).length, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center space-x-4">
                      <div className="w-32 text-sm text-gray-700">{item.label}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div 
                          className={`${item.color} h-4 rounded-full transition-all duration-500`}
                          style={{ width: `${students.length > 0 ? (item.count / students.length) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Engajamento dos Alunos</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Média de Engajamento:</span>
                      <span className="font-medium text-gray-900">
                        {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.engagement, 0) / students.length) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Alunos Ativos (7 dias):</span>
                      <span className="font-medium text-gray-900">{activeStudents}/{students.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Taxa de Conclusão:</span>
                      <span className="font-medium text-gray-900">
                        {students.length > 0 
                          ? Math.round((students.reduce((sum, s) => sum + s.completedAssignments, 0) / students.reduce((sum, s) => sum + s.totalAssignments, 0)) * 100)
                          : 0
                        }%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Estatísticas de Atividades</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total de Atividades:</span>
                      <span className="font-medium text-gray-900">{assignments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Atividades Ativas:</span>
                      <span className="font-medium text-gray-900">
                        {assignments.filter(a => a.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Taxa de Entrega Geral:</span>
                      <span className="font-medium text-gray-900">{submissionRate.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pendente Correção:</span>
                      <span className="font-medium text-gray-900">
                        {assignments.reduce((sum, a) => sum + (a.submissions - a.graded), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};