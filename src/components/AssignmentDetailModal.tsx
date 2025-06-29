import React, { useState } from 'react';
import { X, FileText, Calendar, Clock, Upload, Send, Download, Eye, Star, MessageCircle } from 'lucide-react';

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

interface AssignmentDetailModalProps {
  assignment: Assignment;
  onClose: () => void;
  onSubmit: (assignmentId: string, submissionData: { text: string; attachments: string[] }) => void;
}

export const AssignmentDetailModal: React.FC<AssignmentDetailModalProps> = ({ 
  assignment, 
  onClose, 
  onSubmit 
}) => {
  const [submissionText, setSubmissionText] = useState(assignment.submissionText || '');
  const [submissionAttachments, setSubmissionAttachments] = useState<string[]>(assignment.submissionAttachments || []);
  const [newAttachment, setNewAttachment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'submission' | 'feedback'>('details');

  const handleSubmit = () => {
    if (assignment.status === 'pending') {
      onSubmit(assignment.id, {
        text: submissionText,
        attachments: submissionAttachments
      });
      onClose();
    }
  };

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setSubmissionAttachments(prev => [...prev, newAttachment.trim()]);
      setNewAttachment('');
    }
  };

  const removeAttachment = (index: number) => {
    setSubmissionAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const typeColors = {
    assignment: 'bg-blue-500',
    quiz: 'bg-green-500',
    project: 'bg-purple-500',
    exam: 'bg-red-500'
  };

  const typeLabels = {
    assignment: 'Tarefa',
    quiz: 'Quiz',
    project: 'Projeto',
    exam: 'Prova'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-green-100 text-green-800'
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa'
  };

  const statusColors = {
    pending: 'bg-orange-100 text-orange-800',
    submitted: 'bg-blue-100 text-blue-800',
    graded: 'bg-green-100 text-green-800',
    late: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'Pendente',
    submitted: 'Entregue',
    graded: 'Avaliado',
    late: 'Atrasado'
  };

  const isOverdue = new Date() > new Date(`${assignment.dueDate}T${assignment.dueTime}`);
  const canSubmit = assignment.status === 'pending' && submissionText.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className={`${typeColors[assignment.type]} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                  {typeLabels[assignment.type]}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[assignment.priority]}`}>
                  Prioridade {priorityLabels[assignment.priority]}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[assignment.status]}`}>
                  {statusLabels[assignment.status]}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-1">{assignment.title}</h2>
              <p className="text-white text-opacity-90">{assignment.class}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Prazo: {new Date(assignment.dueDate).toLocaleDateString('pt-BR')} às {assignment.dueTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>{assignment.points} pontos</span>
            </div>
            {isOverdue && assignment.status === 'pending' && (
              <div className="flex items-center space-x-2 bg-red-500 bg-opacity-20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span>Prazo vencido</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'details', label: 'Detalhes', icon: FileText },
              { id: 'submission', label: 'Entrega', icon: Upload },
              ...(assignment.status === 'graded' ? [{ id: 'feedback', label: 'Feedback', icon: MessageCircle }] : [])
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
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instruções</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{assignment.instructions}</p>
                </div>
              </div>

              {assignment.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Materiais de Apoio</h3>
                  <div className="space-y-2">
                    {assignment.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{attachment}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 transition-all flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>Baixar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submission Tab */}
          {activeTab === 'submission' && (
            <div className="space-y-6">
              {assignment.status === 'pending' ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sua Resposta</h3>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Digite sua resposta aqui..."
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Anexos</h3>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newAttachment}
                          onChange={(e) => setNewAttachment(e.target.value)}
                          placeholder="Nome do arquivo ou URL"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
                        />
                        <button
                          onClick={addAttachment}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-1"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Adicionar</span>
                        </button>
                      </div>

                      {submissionAttachments.length > 0 && (
                        <div className="space-y-2">
                          {submissionAttachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <span className="text-gray-700">{attachment}</span>
                              <button
                                onClick={() => removeAttachment(index)}
                                className="text-red-500 hover:text-red-700 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sua Entrega</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{assignment.submissionText}</p>
                    </div>
                    {assignment.submittedAt && (
                      <p className="text-sm text-gray-500 mt-2">
                        Entregue em: {new Date(assignment.submittedAt).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>

                  {assignment.submissionAttachments && assignment.submissionAttachments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Anexos Entregues</h3>
                      <div className="space-y-2">
                        {assignment.submissionAttachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-700">{attachment}</span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 transition-all flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>Ver</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && assignment.status === 'graded' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-900">Avaliação</h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{assignment.grade}</div>
                    <div className="text-sm text-green-700">de {assignment.points} pontos</div>
                    <div className="text-xs text-green-600">
                      {Math.round((assignment.grade! / assignment.points) * 100)}%
                    </div>
                  </div>
                </div>
                
                {assignment.feedback && (
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">Comentários do Professor</h4>
                    <p className="text-green-800 leading-relaxed">{assignment.feedback}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Dicas para Melhorar</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Continue praticando exercícios similares</li>
                  <li>• Revise os conceitos fundamentais</li>
                  <li>• Procure o professor em caso de dúvidas</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {assignment.status === 'pending' && (
                <span className={isOverdue ? 'text-red-600' : ''}>
                  {isOverdue ? 'Prazo vencido' : `Prazo: ${new Date(assignment.dueDate).toLocaleDateString('pt-BR')} às ${assignment.dueTime}`}
                </span>
              )}
              {assignment.status === 'submitted' && (
                <span className="text-blue-600">Aguardando correção</span>
              )}
              {assignment.status === 'graded' && (
                <span className="text-green-600">Atividade avaliada</span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Fechar
              </button>
              
              {assignment.status === 'pending' && (
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`px-6 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                    canSubmit
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Entregar Atividade</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};