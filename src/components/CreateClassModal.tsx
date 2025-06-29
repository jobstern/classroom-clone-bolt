import React, { useState } from 'react';
import { X, BookOpen, Users, Palette, Copy } from 'lucide-react';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClass: (classData: ClassFormData) => void;
}

export interface ClassFormData {
  name: string;
  subject: string;
  description: string;
  color: string;
  section?: string;
  room?: string;
}

const colorOptions = [
  { name: 'Azul', value: 'blue', bg: 'bg-blue-500', border: 'border-blue-500' },
  { name: 'Verde', value: 'green', bg: 'bg-green-500', border: 'border-green-500' },
  { name: 'Roxo', value: 'purple', bg: 'bg-purple-500', border: 'border-purple-500' },
  { name: 'Rosa', value: 'pink', bg: 'bg-pink-500', border: 'border-pink-500' },
  { name: 'Laranja', value: 'orange', bg: 'bg-orange-500', border: 'border-orange-500' },
  { name: 'Vermelho', value: 'red', bg: 'bg-red-500', border: 'border-red-500' },
  { name: 'Amarelo', value: 'yellow', bg: 'bg-yellow-500', border: 'border-yellow-500' },
  { name: 'Índigo', value: 'indigo', bg: 'bg-indigo-500', border: 'border-indigo-500' }
];

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose, onCreateClass }) => {
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    subject: '',
    description: '',
    color: 'blue',
    section: '',
    room: ''
  });

  const [errors, setErrors] = useState<Partial<ClassFormData>>({});

  const handleInputChange = (field: keyof ClassFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClassFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da turma é obrigatório';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Matéria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateClass(formData);
      setFormData({
        name: '',
        subject: '',
        description: '',
        color: 'blue',
        section: '',
        room: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      subject: '',
      description: '',
      color: 'blue',
      section: '',
      room: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const selectedColor = colorOptions.find(c => c.value === formData.color) || colorOptions[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
        {/* Header */}
        <div className={`${selectedColor.bg} p-6 rounded-t-2xl text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Criar Nova Turma</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Informações Básicas</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Turma *
                </label>
                <input
                  id="className"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Matemática - 9º Ano A"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Matéria *
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Matemática"
                />
                {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Descreva os objetivos e conteúdo da turma..."
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Detalhes Adicionais</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                  Turma/Seção
                </label>
                <input
                  id="section"
                  type="text"
                  value={formData.section}
                  onChange={(e) => handleInputChange('section', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: A, B, Manhã, Tarde"
                />
              </div>

              <div>
                <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
                  Sala
                </label>
                <input
                  id="room"
                  type="text"
                  value={formData.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: Sala 101, Lab. Informática"
                />
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Cor da Turma</span>
            </h3>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  className={`w-12 h-12 rounded-xl ${color.bg} hover:scale-110 transition-all duration-200 ${
                    formData.color === color.value 
                      ? `ring-4 ring-offset-2 ${color.border.replace('border-', 'ring-')}` 
                      : 'hover:shadow-lg'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pré-visualização</h3>
            <div className={`${selectedColor.bg} p-4 rounded-xl text-white`}>
              <h4 className="font-semibold text-lg">{formData.name || 'Nome da Turma'}</h4>
              <p className="text-white text-opacity-90">{formData.subject || 'Matéria'}</p>
              {formData.description && (
                <p className="text-white text-opacity-80 text-sm mt-2">{formData.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-3 text-sm text-white text-opacity-90">
                {formData.section && <span>Turma: {formData.section}</span>}
                {formData.room && <span>Sala: {formData.room}</span>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 ${selectedColor.bg} text-white py-3 px-6 rounded-lg hover:opacity-90 transition-all font-medium`}
            >
              Criar Turma
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};