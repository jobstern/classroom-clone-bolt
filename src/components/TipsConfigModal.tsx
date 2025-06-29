import React, { useState } from 'react';
import { X, Brain, Clock, Target, Heart, Lightbulb, Settings, Plus, Trash2, Edit3, Save, AlertCircle } from 'lucide-react';

interface TipsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTipsConfig: (config: TipsConfiguration) => void;
}

interface TipTemplate {
  id: string;
  title: string;
  content: string;
  category: 'time_management' | 'focus' | 'stress' | 'motivation';
  trigger: 'time_spent' | 'inactivity' | 'deadline_approaching' | 'low_engagement' | 'custom';
  triggerValue: number;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  frequency: 'once' | 'daily' | 'weekly' | 'always';
  conditions?: {
    minGrade?: number;
    maxGrade?: number;
    minEngagement?: number;
    maxEngagement?: number;
    timeOfDay?: string[];
    daysOfWeek?: number[];
  };
}

interface TipsConfiguration {
  globalSettings: {
    enabled: boolean;
    maxTipsPerDay: number;
    cooldownMinutes: number;
    respectStudyTime: boolean;
    adaptToPerformance: boolean;
  };
  templates: TipTemplate[];
  categories: {
    [key: string]: {
      enabled: boolean;
      weight: number;
      color: string;
    };
  };
}

const categoryConfig = {
  time_management: { 
    label: 'Gestão de Tempo', 
    icon: Clock, 
    color: 'bg-blue-500',
    description: 'Dicas para organizar e otimizar o tempo de estudo'
  },
  focus: { 
    label: 'Foco', 
    icon: Target, 
    color: 'bg-green-500',
    description: 'Estratégias para manter concentração e atenção'
  },
  stress: { 
    label: 'Gestão de Estresse', 
    icon: Heart, 
    color: 'bg-orange-500',
    description: 'Técnicas para reduzir ansiedade e estresse'
  },
  motivation: { 
    label: 'Motivação', 
    icon: Lightbulb, 
    color: 'bg-purple-500',
    description: 'Estratégias para manter motivação e engajamento'
  }
};

const triggerOptions = [
  { value: 'time_spent', label: 'Tempo de Estudo', description: 'Após X minutos estudando' },
  { value: 'inactivity', label: 'Inatividade', description: 'Após X minutos sem atividade' },
  { value: 'deadline_approaching', label: 'Prazo Próximo', description: 'X horas antes do prazo' },
  { value: 'low_engagement', label: 'Baixo Engajamento', description: 'Quando engajamento < X%' },
  { value: 'custom', label: 'Personalizado', description: 'Condições específicas' }
];

const defaultTips: TipTemplate[] = [
  {
    id: '1',
    title: 'Técnica Pomodoro',
    content: 'Que tal fazer uma pausa? Você tem estudado por um tempo. A técnica Pomodoro sugere 25 minutos de foco seguidos de 5 minutos de descanso.',
    category: 'time_management',
    trigger: 'time_spent',
    triggerValue: 25,
    isActive: true,
    priority: 'medium',
    frequency: 'always'
  },
  {
    id: '2',
    title: 'Mantenha o Foco',
    content: 'Parece que você está inativo há um tempo. Que tal retomar seus estudos? Defina uma meta pequena para começar!',
    category: 'focus',
    trigger: 'inactivity',
    triggerValue: 10,
    isActive: true,
    priority: 'high',
    frequency: 'always'
  },
  {
    id: '3',
    title: 'Prazo Próximo',
    content: 'Atenção! Você tem uma atividade com prazo próximo. Organize seu tempo para concluí-la sem estresse.',
    category: 'stress',
    trigger: 'deadline_approaching',
    triggerValue: 24,
    isActive: true,
    priority: 'high',
    frequency: 'once'
  },
  {
    id: '4',
    title: 'Você Consegue!',
    content: 'Continue assim! Cada pequeno progresso é uma vitória. Celebre suas conquistas e mantenha a motivação.',
    category: 'motivation',
    trigger: 'low_engagement',
    triggerValue: 30,
    isActive: true,
    priority: 'medium',
    frequency: 'daily'
  }
];

const defaultConfig: TipsConfiguration = {
  globalSettings: {
    enabled: true,
    maxTipsPerDay: 5,
    cooldownMinutes: 30,
    respectStudyTime: true,
    adaptToPerformance: true
  },
  templates: defaultTips,
  categories: {
    time_management: { enabled: true, weight: 1, color: '#3b82f6' },
    focus: { enabled: true, weight: 1, color: '#10b981' },
    stress: { enabled: true, weight: 1.2, color: '#f59e0b' },
    motivation: { enabled: true, weight: 0.8, color: '#8b5cf6' }
  }
};

export const TipsConfigModal: React.FC<TipsConfigModalProps> = ({ isOpen, onClose, onSaveTipsConfig }) => {
  const [config, setConfig] = useState<TipsConfiguration>(defaultConfig);
  const [activeTab, setActiveTab] = useState<'global' | 'categories' | 'templates'>('global');
  const [editingTip, setEditingTip] = useState<TipTemplate | null>(null);
  const [isCreatingTip, setIsCreatingTip] = useState(false);

  const handleSave = () => {
    onSaveTipsConfig(config);
    onClose();
  };

  const handleGlobalSettingChange = (key: keyof typeof config.globalSettings, value: any) => {
    setConfig(prev => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        [key]: value
      }
    }));
  };

  const handleCategoryChange = (category: string, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [key]: value
        }
      }
    }));
  };

  const handleTipChange = (tipId: string, updates: Partial<TipTemplate>) => {
    setConfig(prev => ({
      ...prev,
      templates: prev.templates.map(tip => 
        tip.id === tipId ? { ...tip, ...updates } : tip
      )
    }));
  };

  const handleDeleteTip = (tipId: string) => {
    setConfig(prev => ({
      ...prev,
      templates: prev.templates.filter(tip => tip.id !== tipId)
    }));
  };

  const handleCreateTip = (newTip: Omit<TipTemplate, 'id'>) => {
    const tip: TipTemplate = {
      ...newTip,
      id: Date.now().toString()
    };
    
    setConfig(prev => ({
      ...prev,
      templates: [...prev.templates, tip]
    }));
    
    setIsCreatingTip(false);
  };

  const handleEditTip = (tip: TipTemplate) => {
    setEditingTip(tip);
  };

  const handleSaveEditedTip = (updatedTip: TipTemplate) => {
    handleTipChange(updatedTip.id, updatedTip);
    setEditingTip(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Configuração das Dicas</h2>
                <p className="text-white text-opacity-90">Personalize as dicas de autorregulação para seus alunos</p>
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

        <div className="flex h-[calc(95vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('global')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                  activeTab === 'global'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Configurações Gerais</span>
              </button>
              
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                  activeTab === 'categories'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Categorias</span>
              </button>
              
              <button
                onClick={() => setActiveTab('templates')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                  activeTab === 'templates'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Templates de Dicas</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Estatísticas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dicas Ativas:</span>
                  <span className="font-medium">{config.templates.filter(t => t.isActive).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categorias:</span>
                  <span className="font-medium">{Object.values(config.categories).filter(c => c.enabled).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Máx./Dia:</span>
                  <span className="font-medium">{config.globalSettings.maxTipsPerDay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Global Settings Tab */}
            {activeTab === 'global' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Configurações Gerais</h3>
                  <p className="text-gray-600 mb-6">Configure o comportamento global do sistema de dicas.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Controles Principais</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-900">Sistema Ativo</label>
                          <p className="text-xs text-gray-600">Ativar/desativar todas as dicas</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.globalSettings.enabled}
                            onChange={(e) => handleGlobalSettingChange('enabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Máximo de Dicas por Dia
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={config.globalSettings.maxTipsPerDay}
                          onChange={(e) => handleGlobalSettingChange('maxTipsPerDay', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-600 mt-1">Limite diário de dicas por aluno</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Intervalo entre Dicas (minutos)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="180"
                          value={config.globalSettings.cooldownMinutes}
                          onChange={(e) => handleGlobalSettingChange('cooldownMinutes', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-600 mt-1">Tempo mínimo entre dicas consecutivas</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Configurações Avançadas</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-900">Respeitar Horário de Estudo</label>
                          <p className="text-xs text-gray-600">Não interromper durante sessões intensas</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.globalSettings.respectStudyTime}
                            onChange={(e) => handleGlobalSettingChange('respectStudyTime', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-900">Adaptar ao Desempenho</label>
                          <p className="text-xs text-gray-600">Personalizar dicas baseado no progresso</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.globalSettings.adaptToPerformance}
                            onChange={(e) => handleGlobalSettingChange('adaptToPerformance', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium text-blue-900">Dica de Configuração</h5>
                          <p className="text-xs text-blue-700 mt-1">
                            Recomendamos começar com 3-5 dicas por dia e ajustar baseado no feedback dos alunos.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Configuração de Categorias</h3>
                  <p className="text-gray-600 mb-6">Configure a importância e ativação de cada categoria de dica.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(categoryConfig).map(([key, category]) => {
                    const categorySettings = config.categories[key];
                    const Icon = category.icon;
                    
                    return (
                      <div key={key} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{category.label}</h4>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                          </div>
                          
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={categorySettings.enabled}
                              onChange={(e) => handleCategoryChange(key, 'enabled', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Peso da Categoria: {categorySettings.weight}x
                            </label>
                            <input
                              type="range"
                              min="0.1"
                              max="2"
                              step="0.1"
                              value={categorySettings.weight}
                              onChange={(e) => handleCategoryChange(key, 'weight', parseFloat(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              disabled={!categorySettings.enabled}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Baixa</span>
                              <span>Normal</span>
                              <span>Alta</span>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600">
                            <p><strong>Dicas ativas:</strong> {config.templates.filter(t => t.category === key && t.isActive).length}</p>
                            <p><strong>Total de templates:</strong> {config.templates.filter(t => t.category === key).length}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Templates de Dicas</h3>
                    <p className="text-gray-600">Gerencie as dicas que serão exibidas aos alunos.</p>
                  </div>
                  <button
                    onClick={() => setIsCreatingTip(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova Dica</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {config.templates.map((tip) => {
                    const category = categoryConfig[tip.category];
                    const Icon = category.icon;
                    const trigger = triggerOptions.find(t => t.value === tip.trigger);
                    
                    return (
                      <div key={tip.id} className={`border-2 rounded-xl p-4 transition-all ${
                        tip.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center ${
                              !tip.isActive ? 'opacity-50' : ''
                            }`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className={`font-semibold ${tip.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                {tip.title}
                              </h4>
                              <p className="text-xs text-gray-500">{category.label}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditTip(tip)}
                              className="text-gray-400 hover:text-gray-600 transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTip(tip.id)}
                              className="text-gray-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tip.isActive}
                                onChange={(e) => handleTipChange(tip.id, { isActive: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                        </div>

                        <p className={`text-sm mb-3 ${tip.isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                          {tip.content}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full ${
                              tip.priority === 'high' ? 'bg-red-100 text-red-700' :
                              tip.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {tip.priority === 'high' ? 'Alta' : tip.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                            <span className="text-gray-500">
                              {trigger?.label}: {tip.triggerValue}{tip.trigger === 'time_spent' || tip.trigger === 'inactivity' ? 'min' : tip.trigger === 'deadline_approaching' ? 'h' : '%'}
                            </span>
                          </div>
                          <span className="text-gray-500 capitalize">{tip.frequency}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {config.templates.filter(t => t.isActive).length} dicas ativas de {config.templates.length} templates
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Create Tip Modal */}
      {(editingTip || isCreatingTip) && (
        <TipEditorModal
          tip={editingTip}
          isOpen={true}
          onClose={() => {
            setEditingTip(null);
            setIsCreatingTip(false);
          }}
          onSave={editingTip ? handleSaveEditedTip : handleCreateTip}
        />
      )}
    </div>
  );
};

// Tip Editor Modal Component
interface TipEditorModalProps {
  tip: TipTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tip: TipTemplate | Omit<TipTemplate, 'id'>) => void;
}

const TipEditorModal: React.FC<TipEditorModalProps> = ({ tip, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<TipTemplate, 'id'>>({
    title: tip?.title || '',
    content: tip?.content || '',
    category: tip?.category || 'time_management',
    trigger: tip?.trigger || 'time_spent',
    triggerValue: tip?.triggerValue || 25,
    isActive: tip?.isActive ?? true,
    priority: tip?.priority || 'medium',
    frequency: tip?.frequency || 'always',
    conditions: tip?.conditions || {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tip) {
      onSave({ ...tip, ...formData });
    } else {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {tip ? 'Editar Dica' : 'Nova Dica'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(categoryConfig).map(([key, category]) => (
                  <option key={key} value={key}>{category.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gatilho</label>
              <select
                value={formData.trigger}
                onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {triggerOptions.map((trigger) => (
                  <option key={trigger.value} value={trigger.value}>{trigger.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Gatilho</label>
              <input
                type="number"
                value={formData.triggerValue}
                onChange={(e) => setFormData(prev => ({ ...prev, triggerValue: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequência</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="once">Uma vez</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="always">Sempre</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Dica ativa
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              {tip ? 'Salvar Alterações' : 'Criar Dica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};