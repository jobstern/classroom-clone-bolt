import React, { useState } from 'react';
import { X, Search, Filter, Download, Play, Eye, BookOpen, Video, FileText, Headphones, Image, Star, Clock, User } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'audio' | 'image' | 'link';
  subject: string;
  topic: string;
  duration?: string;
  size?: string;
  rating: number;
  downloads: number;
  author: string;
  date: string;
  thumbnail?: string;
  url: string;
}

interface ResourceLibraryModalProps {
  onClose: () => void;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Equações Quadráticas - Aula Completa',
    description: 'Videoaula completa sobre resolução de equações do segundo grau com exemplos práticos',
    type: 'video',
    subject: 'Matemática',
    topic: 'Álgebra',
    duration: '45:30',
    rating: 4.8,
    downloads: 1250,
    author: 'Prof. Carlos Silva',
    date: '2025-01-10',
    thumbnail: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?w=300',
    url: '#'
  },
  {
    id: '2',
    title: 'Resumo - Leis de Newton',
    description: 'PDF com resumo completo das três leis de Newton com exercícios resolvidos',
    type: 'pdf',
    subject: 'Física',
    topic: 'Mecânica',
    size: '2.5 MB',
    rating: 4.6,
    downloads: 890,
    author: 'Prof. Ana Costa',
    date: '2025-01-08',
    url: '#'
  },
  {
    id: '3',
    title: 'Podcast - História do Brasil',
    description: 'Episódio sobre o período colonial brasileiro com análise detalhada',
    type: 'audio',
    subject: 'História',
    topic: 'Brasil Colonial',
    duration: '32:15',
    rating: 4.7,
    downloads: 567,
    author: 'Prof. João Santos',
    date: '2025-01-05',
    url: '#'
  },
  {
    id: '4',
    title: 'Infográfico - Tabela Periódica',
    description: 'Visualização interativa da tabela periódica com propriedades dos elementos',
    type: 'image',
    subject: 'Química',
    topic: 'Elementos Químicos',
    rating: 4.9,
    downloads: 2100,
    author: 'Prof. Maria Oliveira',
    date: '2025-01-03',
    thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?w=300',
    url: '#'
  },
  {
    id: '5',
    title: 'Simulado ENEM - Matemática',
    description: 'Simulado completo de matemática no formato ENEM com gabarito comentado',
    type: 'pdf',
    subject: 'Matemática',
    topic: 'ENEM',
    size: '4.2 MB',
    rating: 4.5,
    downloads: 3200,
    author: 'Equipe EduPlatform',
    date: '2025-01-01',
    url: '#'
  },
  {
    id: '6',
    title: 'Experimento Virtual - Circuitos',
    description: 'Simulação interativa de circuitos elétricos para prática online',
    type: 'link',
    subject: 'Física',
    topic: 'Eletricidade',
    rating: 4.4,
    downloads: 780,
    author: 'Lab Virtual',
    date: '2024-12-28',
    url: '#'
  }
];

const subjects = ['Todas', 'Matemática', 'Física', 'Química', 'História', 'Português', 'Biologia'];
const types = ['Todos', 'video', 'pdf', 'audio', 'image', 'link'];

export const ResourceLibraryModal: React.FC<ResourceLibraryModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Todas');
  const [selectedType, setSelectedType] = useState('Todos');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'downloads'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredResources = mockResources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.topic.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'Todas' || resource.subject === selectedSubject;
      const matchesType = selectedType === 'Todos' || resource.type === selectedType;
      
      return matchesSearch && matchesSubject && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'pdf': return FileText;
      case 'audio': return Headphones;
      case 'image': return Image;
      case 'link': return BookOpen;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-600';
      case 'pdf': return 'bg-blue-100 text-blue-600';
      case 'audio': return 'bg-purple-100 text-purple-600';
      case 'image': return 'bg-green-100 text-green-600';
      case 'link': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Vídeo';
      case 'pdf': return 'PDF';
      case 'audio': return 'Áudio';
      case 'image': return 'Imagem';
      case 'link': return 'Link';
      default: return 'Arquivo';
    }
  };

  const handleResourceClick = (resource: Resource) => {
    // Track interaction and open resource
    console.log('Opening resource:', resource.title);
  };

  const handleDownload = (resource: Resource, e: React.MouseEvent) => {
    e.stopPropagation();
    // Track download and initiate download
    console.log('Downloading resource:', resource.title);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Biblioteca de Recursos</h2>
                <p className="text-white text-opacity-90">Materiais de apoio para seus estudos</p>
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

        <div className="p-6">
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Todos">Todos os tipos</option>
                {types.slice(1).map(type => (
                  <option key={type} value={type}>{getTypeLabel(type)}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Mais recentes</option>
                <option value="rating">Melhor avaliados</option>
                <option value="downloads">Mais baixados</option>
              </select>
            </div>
          </div>

          {/* Results Count and View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {filteredResources.length} recursos encontrados
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="bg-current h-0.5 rounded-sm"></div>
                  <div className="bg-current h-0.5 rounded-sm"></div>
                  <div className="bg-current h-0.5 rounded-sm"></div>
                  <div className="bg-current h-0.5 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Resources Grid/List */}
          <div className="max-h-[60vh] overflow-y-auto">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => {
                  const TypeIcon = getTypeIcon(resource.type);
                  return (
                    <div
                      key={resource.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => handleResourceClick(resource)}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-gray-100">
                        {resource.thumbnail ? (
                          <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <TypeIcon className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                            {getTypeLabel(resource.type)}
                          </span>
                        </div>
                        {resource.duration && (
                          <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                            {resource.duration}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {resource.title}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{resource.subject} • {resource.topic}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{resource.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>{resource.author}</span>
                          </div>
                          <button
                            onClick={(e) => handleDownload(resource, e)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-1 text-xs"
                          >
                            {resource.type === 'link' ? <Eye className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                            <span>{resource.type === 'link' ? 'Abrir' : 'Baixar'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResources.map((resource) => {
                  const TypeIcon = getTypeIcon(resource.type);
                  return (
                    <div
                      key={resource.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => handleResourceClick(resource)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                            <TypeIcon className="w-6 h-6" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {resource.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{resource.subject} • {resource.topic}</span>
                                <span>{resource.author}</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  <span>{resource.rating}</span>
                                </div>
                                <span>{resource.downloads} downloads</span>
                                {resource.duration && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{resource.duration}</span>
                                  </div>
                                )}
                                {resource.size && <span>{resource.size}</span>}
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => handleDownload(resource, e)}
                              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                            >
                              {resource.type === 'link' ? <Eye className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                              <span>{resource.type === 'link' ? 'Abrir' : 'Baixar'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum recurso encontrado</h3>
                <p className="text-gray-600">Tente ajustar os filtros de busca para encontrar mais recursos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};