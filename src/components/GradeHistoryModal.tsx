import React, { useState } from 'react';
import { X, BarChart3, TrendingUp, Award, Calendar, Filter, Download } from 'lucide-react';

interface Grade {
  id: string;
  assignmentTitle: string;
  className: string;
  grade: number;
  maxPoints: number;
  date: string;
  feedback: string;
}

interface GradeHistoryModalProps {
  grades: Grade[];
  onClose: () => void;
}

export const GradeHistoryModal: React.FC<GradeHistoryModalProps> = ({ grades, onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '30' | '90' | '180'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const subjects = Array.from(new Set(grades.map(g => g.className)));
  
  const filteredGrades = grades.filter(grade => {
    const gradeDate = new Date(grade.date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - gradeDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const matchesPeriod = selectedPeriod === 'all' || daysDiff <= parseInt(selectedPeriod);
    const matchesSubject = selectedSubject === 'all' || grade.className === selectedSubject;
    
    return matchesPeriod && matchesSubject;
  });

  const averageGrade = filteredGrades.length > 0 
    ? filteredGrades.reduce((sum, g) => sum + (g.grade / g.maxPoints * 100), 0) / filteredGrades.length 
    : 0;

  const gradeDistribution = {
    excellent: filteredGrades.filter(g => (g.grade / g.maxPoints) >= 0.9).length,
    good: filteredGrades.filter(g => (g.grade / g.maxPoints) >= 0.7 && (g.grade / g.maxPoints) < 0.9).length,
    average: filteredGrades.filter(g => (g.grade / g.maxPoints) >= 0.6 && (g.grade / g.maxPoints) < 0.7).length,
    poor: filteredGrades.filter(g => (g.grade / g.maxPoints) < 0.6).length
  };

  const subjectAverages = subjects.map(subject => {
    const subjectGrades = filteredGrades.filter(g => g.className === subject);
    const average = subjectGrades.length > 0 
      ? subjectGrades.reduce((sum, g) => sum + (g.grade / g.maxPoints * 100), 0) / subjectGrades.length 
      : 0;
    return { subject, average, count: subjectGrades.length };
  });

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-blue-100 text-blue-800';
    if (percentage >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Histórico de Notas</h2>
                <p className="text-white text-opacity-90">Acompanhe seu desempenho acadêmico</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2">
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

        <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os períodos</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 3 meses</option>
                <option value="180">Últimos 6 meses</option>
              </select>
            </div>
            
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as matérias</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Média Geral</p>
                  <p className="text-3xl font-bold text-blue-700">{averageGrade.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Notas Excelentes</p>
                  <p className="text-3xl font-bold text-green-700">{gradeDistribution.excellent}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total de Avaliações</p>
                  <p className="text-3xl font-bold text-purple-700">{filteredGrades.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Melhor Nota</p>
                  <p className="text-3xl font-bold text-orange-700">
                    {filteredGrades.length > 0 
                      ? Math.max(...filteredGrades.map(g => Math.round((g.grade / g.maxPoints) * 100)))
                      : 0
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Grade Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Notas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Excelente (90-100%)</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${filteredGrades.length > 0 ? (gradeDistribution.excellent / filteredGrades.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{gradeDistribution.excellent}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bom (70-89%)</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${filteredGrades.length > 0 ? (gradeDistribution.good / filteredGrades.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{gradeDistribution.good}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Regular (60-69%)</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${filteredGrades.length > 0 ? (gradeDistribution.average / filteredGrades.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{gradeDistribution.average}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Insuficiente (&lt;60%)</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${filteredGrades.length > 0 ? (gradeDistribution.poor / filteredGrades.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{gradeDistribution.poor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Desempenho por Matéria</h3>
              <div className="space-y-4">
                {subjectAverages.map((item) => (
                  <div key={item.subject} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.subject}</span>
                        <span className={`text-sm font-bold ${getGradeColor(item.average)}`}>
                          {item.average.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            item.average >= 90 ? 'bg-green-500' :
                            item.average >= 70 ? 'bg-blue-500' :
                            item.average >= 60 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${item.average}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.count} avaliações</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Grades List */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Detalhado</h3>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGrades
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((grade) => {
                        const percentage = Math.round((grade.grade / grade.maxPoints) * 100);
                        return (
                          <tr key={grade.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{grade.assignmentTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{grade.className}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-bold ${getGradeColor(percentage)}`}>
                                {grade.grade}/{grade.maxPoints}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeBadge(percentage)}`}>
                                {percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600 flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(grade.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600 max-w-xs truncate" title={grade.feedback}>
                                {grade.feedback}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              
              {filteredGrades.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma nota encontrada</h3>
                  <p className="text-gray-600">Tente ajustar os filtros para ver mais resultados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};