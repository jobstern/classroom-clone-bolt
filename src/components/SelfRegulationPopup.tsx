import React from 'react';
import { X, Lightbulb, Clock, Target, Heart } from 'lucide-react';
import { SelfRegulationTip } from '../types';

interface SelfRegulationPopupProps {
  tip: SelfRegulationTip;
  onDismiss: () => void;
}

const categoryIcons = {
  time_management: Clock,
  focus: Target,
  stress: Heart,
  motivation: Lightbulb
};

const categoryColors = {
  time_management: 'bg-blue-500',
  focus: 'bg-green-500',
  stress: 'bg-orange-500',
  motivation: 'bg-purple-500'
};

export const SelfRegulationPopup: React.FC<SelfRegulationPopupProps> = ({ tip, onDismiss }) => {
  const Icon = categoryIcons[tip.category];
  const colorClass = categoryColors[tip.category];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-in zoom-in duration-300">
        <div className={`${colorClass} p-6 rounded-t-2xl text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold">{tip.title}</h3>
            </div>
            <button
              onClick={onDismiss}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-6">{tip.content}</p>
          
          <div className="flex space-x-3">
            <button
              onClick={onDismiss}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Dispensar
            </button>
            <button
              onClick={onDismiss}
              className={`flex-1 ${colorClass} text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all font-medium`}
            >
              Entendi!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};