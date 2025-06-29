import { useState, useCallback, useRef } from 'react';
import { useInteractions } from './useDatabase';
import { Interaction } from '../types';

export const useInteractionTracking = (studentId: string) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const { trackInteraction: dbTrackInteraction } = useInteractions(studentId);
  const startTime = useRef<number>(Date.now());
  const currentActivity = useRef<string | null>(null);

  const trackInteraction = useCallback(async (
    type: Interaction['type'],
    target: string,
    metadata?: Record<string, any>
  ) => {
    if (!studentId) return;

    const interaction: Interaction = {
      id: `${Date.now()}-${Math.random()}`,
      studentId,
      type,
      target,
      timestamp: new Date(),
      metadata
    };

    setInteractions(prev => [...prev, interaction]);
    
    // Save to database
    await dbTrackInteraction({
      student_id: studentId,
      type,
      target,
      metadata: metadata || null
    });
  }, [studentId, dbTrackInteraction]);

  const startActivity = useCallback((activityId: string) => {
    currentActivity.current = activityId;
    startTime.current = Date.now();
    trackInteraction('view', activityId);
  }, [trackInteraction]);

  const endActivity = useCallback(() => {
    if (currentActivity.current) {
      const duration = Date.now() - startTime.current;
      trackInteraction('view', currentActivity.current, { duration });
      currentActivity.current = null;
    }
  }, [trackInteraction]);

  return { interactions, trackInteraction, startActivity, endActivity };
};