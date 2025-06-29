import React, { useState } from 'react';
import { X, Award, User, FileText, Download, Eye, Save, Send, MessageCircle, Star, Clock, CheckCircle } from 'lucide-react';

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

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  submissionText: string;
  attachments: string[];
  submittedAt: string;
  grade?: number;
  feedback?: string;
  isLate: boolean;
}

interface GradingModalProps {
  assignment: AssignmentData;
  onClose: () => void;
  onGradeSubmitted: (assignmentId: string, gradedCount: number) => void;
}

// Mock submissions data
const mockSubmissions: Submission[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'João Santos',
    studentAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
    submissionText: 'Resolvi todas as equações usando a fórmula de Bhaskara. Para a primeira equação x² - 5x + 6 = 0, encontrei as raízes x₁ = 2 e x₂ = 3. Para a segunda equação 2x² - 7x + 3 = 0, as raízes são x₁ = 3 e x₂ = 0.5. Verifiquei todas as soluções substituindo nas equações originais.',
    attachments: ['resolucao_exercicios.pdf', 'graficos.png'],
    submittedAt: '2025-01-15T14:30:00Z',
    isLate: false
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Ana Costa',
    studentAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
    submissionText: 'Completei os exercícios propostos. Tive algumas dificuldades com a terceira questão, mas consegui resolver usando o método de completar quadrados. Anexei minha resolução detalhada.',
    attachments: ['ana_resolucao.pdf'],
    submittedAt: '2025-01-16T09:15:00Z',
    grade: 8.5,
    feedback: 'Bom trabalho! Demonstrou compreensão dos conceitos. Apenas uma pequena confusão na questão 3, mas o método está correto.',
    isLate: false
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Pedro Silva',
    studentAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=150',
    submissionText: 'Desculpe o atraso. Resolvi todos os exercícios, mas tive dúvidas na aplicação da fórmula de Bhaskara em alguns casos. Gostaria de feedback para melhorar.',
    attachments: ['pedro_exercicios.pdf'],
    submittedAt: '2025-01-17T23:45:00Z',
    isLate: true
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'Maria Oliveira',
    studentAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    submissionText: 'Exercícios resolvidos com explicação detalhada de cada passo. Incluí gráficos para visualizar as parábolas e suas raízes. Também adicionei exercícios extras que encontrei.',
    attachments: ['maria_completo.pdf', 'graficos_extras.png', 'exercicios_bonus.pdf'],
    submittedAt: '2025-01-14T16:20:00Z',
    grade: 9.8,
    feedback: 'Excelente trabalho! Demonstrou domínio completo do conteúdo e foi além do solicitado. Os gráficos ajudam muito na compreensão.',
    isLate: false
  }
];

export const GradingModal: React.FC<GradingModalProps> = ({ assignment, onClose, onGradeSubmitted }) => {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(submissions[0] || null);
  const [currentGrade, setCurrentGrade] = useState<string>('');
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'graded' | 'ungraded'>('all');

  const filteredSubmissions = submissions.filter(submission => {
    if (filterStatus === 'graded') return submission.grade !== undefined;
    if (filterStatus === 'ungraded') return submission.grade === undefined;
    return true;
  });

  const ungradedSubmissions = submissions.filter(s => s.grade === undefined);
  const gradedSubmissions = submissions.filter(s => s.grade !== undefined);

  const handleSubmissionSelect = (submission: Submission) => {
    setSelectedSubmission(submission);
    setCurrentGrade(submission.grade?.toString() || '');
    setCurrentFeedback(submission.feedback || '');
  };

  const handleSaveGrade = () => {
    if (!selectedSubmission || !currentGrade) return;

    const grade = parseFloat(currentGrade);
    if (grade < 0 || grade > assignment.points) {
      alert(`A nota deve estar entre 0 e ${assignment.points}`);
      return;
    }

    setSubmissions(prev => prev.map(sub => 
      sub.id === selectedSubmission.id 
        ? { ...sub, grade, feedback: currentFeedback }
        : sub
    ));

    // Update selected submission
    setSelectedSubmission(prev => prev ? { ...prev, grade, feedback: currentFeedback } : null);

    // Move to next ungraded submission
    const currentIndex = submissions.findIndex(s => s.id === selectedSubmission.id);
    const nextUngraded = submissions.slice(currentIndex + 1).find(s => s.grade === undefined);
    if (nextUngraded) {
      handleSubmissionSelect(nextUngraded);
    }
  };

  const handleSaveAndNext = () => {
    handleSaveGrade();
  };

  const handleFinishGrading = () => {
    const newGradedCount = submissions.filter(s => s.grade !== undefined).length;
    onGradeSubmitted(assignment.id, newGradedCount);
    onClose();
  };

  const getGradeColor = (grade: number) => {
    const percentage = (grade / assignment.points) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBadge = (grade: number) => {
    const percentage = (grade / assignment.points) * 100;
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-blue-100 text-blue-800';
    if (percentage >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Correção de Atividades</h2>
                <p className="text-white text-opacity-90">{assignment.title} - {assignment.className}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right text-sm">
                <p>Corrigidas: {gradedSubmissions.length}/{submissions.length}</p>
                <p>Pendentes: {ungradedSubmissions.length}</p>
              </div>
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
          {/* Submissions List */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Entregas</h3>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Todas ({submissions.length})</option>
                <option value="ungraded">Não corrigidas ({ungradedSubmissions.length})</option>
                <option value="graded">Corrigidas ({gradedSubmissions.length})</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => handleSubmissionSelect(submission)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedSubmission?.id === submission.id
                      ? 'bg-orange-100 border-2 border-orange-300'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={submission.studentAvatar}
                      alt={submission.studentName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {submission.studentName}
                        </h4>
                        {submission.grade !== undefined ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {new Date(submission.submittedAt).toLocaleDateString('pt-BR')}
                      </p>
                      {submission.isLate && (
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">
                          Atrasado
                        </span>
                      )}
                      {submission.grade !== undefined && (
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getGradeBadge(submission.grade)}`}>
                            {submission.grade.toFixed(1)}/{assignment.points}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {selectedSubmission ? (
              <>
                {/* Student Info */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedSubmission.studentAvatar}
                        alt={selectedSubmission.studentName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedSubmission.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          
                          Entregue em: {new Date(selectedSubmission.submittedAt).toLocaleString('pt-BR')}
                        </p>
                        {selectedSubmission.isLate && (
                          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">
                            Entrega atrasada
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>Comentar</span>
                      </button>
                      <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-all flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Perfil</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submission Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Submission Text */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Resposta do Aluno</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {selectedSubmission.submissionText}
                        </p>
                      </div>
                    </div>

                    {/* Attachments */}
                    {selectedSubmission.attachments.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Anexos</h4>
                        <div className="space-y-2">
                          {selectedSubmission.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-700">{attachment}</span>
                              </div>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-700 transition-all flex items-center space-x-1">
                                  <Eye className="w-4 h-4" />
                                  <span>Ver</span>
                                </button>
                                <button className="text-gray-600 hover:text-gray-700 transition-all flex items-center space-x-1">
                                  <Download className="w-4 h-4" />
                                  <span>Baixar</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grading Section */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Avaliação</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nota (0 - {assignment.points})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={assignment.points}
                            step="0.1"
                            value={currentGrade}
                            onChange={(e) => setCurrentGrade(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder={`Nota de 0 a ${assignment.points}`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nota Rápida
                          </label>
                          <div className="flex space-x-2">
                            {[
                              { label: 'A', value: assignment.points * 0.9 },
                              { label: 'B', value: assignment.points * 0.8 },
                              { label: 'C', value: assignment.points * 0.7 },
                              { label: 'D', value: assignment.points * 0.6 }
                            ].map((grade) => (
                              <button
                                key={grade.label}
                                onClick={() => setCurrentGrade(grade.value.toString())}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                              >
                                {grade.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Feedback para o Aluno
                        </label>
                        <textarea
                          value={currentFeedback}
                          onChange={(e) => setCurrentFeedback(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                          placeholder="Escreva um feedback construtivo para o aluno..."
                        />
                      </div>

                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={handleSaveGrade}
                          disabled={!currentGrade}
                          className={`flex-1 py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                            currentGrade
                              ? 'bg-orange-600 text-white hover:bg-orange-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar Nota</span>
                        </button>
                        
                        {ungradedSubmissions.length > 1 && (
                          <button
                            onClick={handleSaveAndNext}
                            disabled={!currentGrade}
                            className={`flex-1 py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                              currentGrade
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                            <span>Salvar e Próximo</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Previous Feedback */}
                    {selectedSubmission.grade !== undefined && selectedSubmission.feedback && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Feedback Anterior</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-lg font-bold ${getGradeColor(selectedSubmission.grade)}`}>
                            {selectedSubmission.grade.toFixed(1)}/{assignment.points}
                          </span>
                          <span className="text-sm text-green-700">
                            {Math.round((selectedSubmission.grade / assignment.points) * 100)}%
                          </span>
                        </div>
                        <p className="text-green-800">{selectedSubmission.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma entrega</h3>
                  <p className="text-gray-600">Escolha uma entrega da lista para começar a correção.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Progresso: {gradedSubmissions.length} de {submissions.length} entregas corrigidas
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Fechar
              </button>
              {gradedSubmissions.length === submissions.length && (
                <button
                  onClick={handleFinishGrading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Finalizar Correção</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};