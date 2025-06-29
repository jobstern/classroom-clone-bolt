import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Square, Timer, Target, Coffee, Brain, Volume2, VolumeX } from 'lucide-react';

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
  focus: number;
  notes: string;
}

interface StudyTimerModalProps {
  onClose: () => void;
  onSaveSession: (session: StudySession) => void;
}

type TimerMode = 'pomodoro' | 'custom' | 'stopwatch';
type SessionPhase = 'work' | 'break' | 'longBreak';

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({ onClose, onSaveSession }) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [phase, setPhase] = useState<SessionPhase>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [customTime, setCustomTime] = useState(25);
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [focusRating, setFocusRating] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const pomodoroSettings = {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    if (soundEnabled) {
      // Play notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.play().catch(() => {});
    }

    if (mode === 'pomodoro') {
      if (phase === 'work') {
        setCompletedPomodoros(prev => prev + 1);
        const nextPhase = completedPomodoros > 0 && (completedPomodoros + 1) % 4 === 0 ? 'longBreak' : 'break';
        setPhase(nextPhase);
        setTimeLeft(pomodoroSettings[nextPhase]);
      } else {
        setPhase('work');
        setTimeLeft(pomodoroSettings.work);
      }
    } else {
      setIsRunning(false);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      setTimeLeft(pomodoroSettings.work);
      setPhase('work');
    } else if (mode === 'custom') {
      setTimeLeft(customTime * 60);
    } else {
      setTimeLeft(0);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCompletedPomodoros(0);
    setTotalTime(0);
    setPhase('work');
    if (mode === 'pomodoro') {
      setTimeLeft(pomodoroSettings.work);
    } else if (mode === 'custom') {
      setTimeLeft(customTime * 60);
    } else {
      setTimeLeft(0);
    }
  };

  const saveSession = () => {
    if (totalTime > 60 && subject.trim()) { // At least 1 minute and subject filled
      const session: StudySession = {
        id: Date.now().toString(),
        subject: subject.trim(),
        duration: Math.floor(totalTime / 60), // Convert to minutes
        date: new Date().toISOString().split('T')[0],
        focus: focusRating * 10, // Convert 1-10 to 10-100
        notes: notes.trim()
      };
      onSaveSession(session);
    } else {
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'work': return 'from-blue-600 to-purple-600';
      case 'break': return 'from-green-600 to-blue-600';
      case 'longBreak': return 'from-orange-600 to-red-600';
      default: return 'from-blue-600 to-purple-600';
    }
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case 'work': return Brain;
      case 'break': return Coffee;
      case 'longBreak': return Coffee;
      default: return Timer;
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'work': return 'Foco';
      case 'break': return 'Pausa Curta';
      case 'longBreak': return 'Pausa Longa';
      default: return 'Estudo';
    }
  };

  const PhaseIcon = getPhaseIcon();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getPhaseColor()} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <PhaseIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Timer de Estudo</h2>
                <p className="text-white text-opacity-90">{getPhaseLabel()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
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

        <div className="p-6">
          {/* Mode Selection */}
          <div className="flex space-x-2 mb-6">
            {[
              { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
              { id: 'custom', label: 'Personalizado', icon: Target },
              { id: 'stopwatch', label: 'Cronômetro', icon: Play }
            ].map((modeOption) => (
              <button
                key={modeOption.id}
                onClick={() => {
                  setMode(modeOption.id as TimerMode);
                  resetTimer();
                }}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                  mode === modeOption.id
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <modeOption.icon className="w-4 h-4" />
                <span className="font-medium">{modeOption.label}</span>
              </button>
            ))}
          </div>

          {/* Custom Time Setting */}
          {mode === 'custom' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={customTime}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setCustomTime(value);
                  if (!isRunning) {
                    setTimeLeft(value * 60);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="text-6xl font-mono font-bold text-gray-900 mb-4">
              {mode === 'stopwatch' ? formatTime(totalTime) : formatTime(timeLeft)}
            </div>
            
            {mode === 'pomodoro' && (
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span>Pomodoros: {completedPomodoros}</span>
                <span>•</span>
                <span>Fase: {getPhaseLabel()}</span>
              </div>
            )}
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Iniciar</span>
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all flex items-center space-x-2"
              >
                <Pause className="w-5 h-5" />
                <span>Pausar</span>
              </button>
            )}
            
            <button
              onClick={stopTimer}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all flex items-center space-x-2"
            >
              <Square className="w-5 h-5" />
              <span>Parar</span>
            </button>
            
            <button
              onClick={resetTimer}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all"
            >
              Reset
            </button>
          </div>

          {/* Session Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matéria/Assunto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Matemática - Equações"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas da sessão
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anote o que estudou, dificuldades encontradas, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {totalTime > 60 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Como foi seu foco? (1-10)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={focusRating}
                    onChange={(e) => setFocusRating(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">10</span>
                  <span className="text-sm font-medium text-gray-900 w-8">{focusRating}</span>
                </div>
              </div>
            )}
          </div>

          {/* Session Stats */}
          {totalTime > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Estatísticas da Sessão</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tempo total:</span>
                  <span className="font-medium text-gray-900 ml-2">{Math.floor(totalTime / 60)}min</span>
                </div>
                {mode === 'pomodoro' && (
                  <div>
                    <span className="text-gray-600">Pomodoros:</span>
                    <span className="font-medium text-gray-900 ml-2">{completedPomodoros}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {totalTime > 60 ? `Sessão de ${Math.floor(totalTime / 60)} minutos` : 'Configure sua sessão de estudo'}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={saveSession}
                disabled={totalTime < 60 || !subject.trim()}
                className={`px-6 py-2 rounded-lg transition-all ${
                  totalTime >= 60 && subject.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Salvar Sessão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};