import React, { useState } from 'react';
import { X, FileText, Calendar, Clock, Users, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAssignment: (assignmentData: AssignmentFormData) => void;
  classes: Array<{ id: string; name: string; color: string }>;
}

export interface AssignmentFormData {
  title: string;
  description: string;
  classId: string;
  dueDate: string;
  dueTime: string;
  points: number;
  instructions: string;
  attachments: string[];
  allowLateSubmission: boolean;
  priority: 'low' | 'medium' | 'high';
  type: 'assignment' | 'quiz' | 'project' | 'exam';
}

const assignmentTypes = [
  { value: 'assignment', label: 'Tarefa', icon: FileText, color: 'bg-blue-500' },
  { value: 'quiz', label: 'Quiz', icon: Clock, color: 'bg-green-500' },
  { value: 'project', label: 'Projeto', icon: Users, color: 'bg-purple-500' },
  { value: 'exam', label: 'Prova', icon: AlertCircle, color: 'bg-red-500' }
];

const priorityOptions = [
  { value: 'low', label: 'Baixa', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'medium', label: 'Média', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'high', label: 'Alta', color: 'bg-red-100 text-red-800 border-red-200' }
];

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreateAssignment, 
  classes 
}) => {
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: '',
    description: '',
    classId: '',
    dueDate: '',
    dueTime: '23:59',
    points: 100,
    instructions: '',
    attachments: [],
    allowLateSubmission: false,
    priority: 'medium',
    type: 'assignment'
  });

  const [errors, setErrors] = useState<Partial<AssignmentFormData>>({});
  const [newAttachment, setNewAttachment] = useState('');

  const handleInputChange = (field: keyof AssignmentFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment.trim()]
      }));
      setNewAttachment('');
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AssignmentFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.classId) {
      newErrors.classId = 'Selecione uma turma';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de entrega é obrigatória';
    }

    if (formData.points <= 0) {
      newErrors.points = 'Pontuação deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateAssignment(formData);
      setFormData({
        title: '',
        description: '',
        classId: '',
        dueDate: '',
        dueTime: '23:59',
        points: 100,
        instructions: '',
        attachments: [],
        allowLateSubmission: false,
        priority: 'medium',
        type: 'assignment'
      });
      setErrors({});
      setNewAttachment('');
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      classId: '',
      dueDate: '',
      dueTime: '23:59',
      points: 100,
      instructions: '',
      attachments: [],
      allowLateSubmission: false,
      priority: 'medium',
      type: 'assignment'
    });
    setErrors({});
    setNewAttachment('');
    onClose();
  };

  if (!isOpen) return null;

  const selectedType = assignmentTypes.find(t => t.value === formData.type) || assignmentTypes[0];
  const selectedClass = classes.find(c => c.id === formData.classId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
        {/* Header */}
        <div className={`${selectedType.color} p-6 rounded-t-2xl text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <selectedType.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Criar Nova Atividade</h2>
                <p className="text-white text-opacity-90">{selectedType.label}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Informações Básicas</span>
                </h3>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Atividade *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Resolução de Equações Quadráticas"
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Descreva brevemente a atividade..."
                  />
                  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Instruções Detalhadas
                  </label>
                  <textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Forneça instruções detalhadas sobre como completar a atividade..."
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Anexos</h3>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="URL do arquivo ou nome do anexo"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
                  />
                  <button
                    type="button"
                    onClick={addAttachment}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700">{attachment}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Assignment Type */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Tipo de Atividade</h3>
                <div className="grid grid-cols-2 gap-2">
                  {assignmentTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.type === type.value
                          ? `${type.color} text-white border-transparent`
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Class Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Turma</h3>
                <select
                  value={formData.classId}
                  onChange={(e) => handleInputChange('classId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.classId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione uma turma</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="text-red-600 text-sm mt-1">{errors.classId}</p>}
              </div>

              {/* Due Date & Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Prazo de Entrega</span>
                </h3>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.dueDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.dueDate && <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>}
                </div>

                <div>
                  <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Horário
                  </label>
                  <input
                    id="dueTime"
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => handleInputChange('dueTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Points */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Pontuação</h3>
                <div>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
                    min="1"
                    max="1000"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.points ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.points && <p className="text-red-600 text-sm mt-1">{errors.points}</p>}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Prioridade</h3>
                <div className="space-y-2">
                  {priorityOptions.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => handleInputChange('priority', priority.value)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        formData.priority === priority.value
                          ? `${priority.color} border-current`
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Opções</h3>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.allowLateSubmission}
                    onChange={(e) => handleInputChange('allowLateSubmission', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Permitir entrega atrasada</span>
                </label>
              </div>

              {/* Preview */}
              {selectedClass && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pré-visualização</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <selectedType.icon className="w-4 h-4 text-gray-500" />
                        <h4 className="font-medium text-gray-900">
                          {formData.title || 'Título da Atividade'}
                        </h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        priorityOptions.find(p => p.value === formData.priority)?.color
                      }`}>
                        {priorityOptions.find(p => p.value === formData.priority)?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{selectedClass.name}</p>
                    <p className="text-sm text-gray-700 mb-3">
                      {formData.description || 'Descrição da atividade'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {formData.dueDate 
                          ? `Prazo: ${new Date(formData.dueDate).toLocaleDateString('pt-BR')} às ${formData.dueTime}`
                          : 'Prazo não definido'
                        }
                      </span>
                      <span>{formData.points} pontos</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 ${selectedType.color} text-white py-3 px-6 rounded-lg hover:opacity-90 transition-all font-medium`}
            >
              Criar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};