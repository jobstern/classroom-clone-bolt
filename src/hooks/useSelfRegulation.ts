import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { SelfRegulationTip, Interaction } from '../types';

export const useSelfRegulation = (studentId: string, interactions: Interaction[]) => {
  const [currentTip, setCurrentTip] = useState<SelfRegulationTip | null>(null);
  const [showTip, setShowTip] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [tips, setTips] = useState<SelfRegulationTip[]>([]);

  // Load tips from database
  useEffect(() => {
    const loadTips = async () => {
      try {
        const { data, error } = await supabase
          .from('self_regulation_tips')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        const formattedTips: SelfRegulationTip[] = data.map(tip => ({
          id: tip.id,
          title: tip.title,
          content: tip.content,
          category: tip.category,
          trigger: tip.trigger_type,
          triggerValue: tip.trigger_value
        }));

        setTips(formattedTips);
      } catch (error) {
        console.error('Error loading tips:', error);
      }
    };

    loadTips();
  }, []);

  const checkTriggers = useCallback(() => {
    if (!studentId || tips.length === 0) return;

    const now = Date.now();
    const timeSpent = now - (interactions[0]?.timestamp.getTime() || now);
    const timeSinceLastActivity = now - lastActivity;

    // Check time spent trigger (25 minutes = 1500 seconds)
    if (timeSpent > 25 * 60 * 1000 && !showTip) {
      const tip = tips.find(t => t.trigger === 'time_spent');
      if (tip) {
        setCurrentTip(tip);
        setShowTip(true);
      }
    }

    // Check inactivity trigger (10 minutes = 600 seconds)
    if (timeSinceLastActivity > 10 * 60 * 1000 && !showTip) {
      const tip = tips.find(t => t.trigger === 'inactivity');
      if (tip) {
        setCurrentTip(tip);
        setShowTip(true);
      }
    }
  }, [interactions, lastActivity, showTip, tips, studentId]);

  useEffect(() => {
    const interval = setInterval(checkTriggers, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkTriggers]);

  useEffect(() => {
    if (interactions.length > 0) {
      setLastActivity(Date.now());
    }
  }, [interactions]);

  const dismissTip = useCallback(async () => {
    setShowTip(false);
    setCurrentTip(null);
    
    // Track tip dismissal in database
    if (currentTip && studentId) {
      try {
        await supabase
          .from('tip_interactions')
          .insert({
            tip_id: currentTip.id,
            student_id: studentId,
            action: 'dismissed'
          });
      } catch (error) {
        console.error('Error tracking tip interaction:', error);
      }
    }
  }, [currentTip, studentId]);

  return { currentTip, showTip, dismissTip };
};