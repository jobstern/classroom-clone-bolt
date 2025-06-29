import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Tables = Database['public']['Tables'];

// Classes
export const useClasses = (teacherId?: string) => {
  const [classes, setClasses] = useState<Tables['classes']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        let query = supabase.from('classes').select('*');
        
        if (teacherId) {
          query = query.eq('teacher_id', teacherId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setClasses(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

  const createClass = async (classData: Tables['classes']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert(classData)
        .select()
        .single();

      if (error) throw error;
      setClasses(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateClass = async (id: string, updates: Tables['classes']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setClasses(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClasses(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { classes, loading, error, createClass, updateClass, deleteClass };
};

// Assignments
export const useAssignments = (classId?: string, teacherId?: string) => {
  const [assignments, setAssignments] = useState<Tables['assignments']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        let query = supabase.from('assignments').select('*');
        
        if (classId) {
          query = query.eq('class_id', classId);
        } else if (teacherId) {
          query = query.eq('teacher_id', teacherId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setAssignments(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [classId, teacherId]);

  const createAssignment = async (assignmentData: Tables['assignments']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert(assignmentData)
        .select()
        .single();

      if (error) throw error;
      setAssignments(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateAssignment = async (id: string, updates: Tables['assignments']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAssignments(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { assignments, loading, error, createAssignment, updateAssignment, deleteAssignment };
};

// Submissions
export const useSubmissions = (assignmentId?: string, studentId?: string) => {
  const [submissions, setSubmissions] = useState<Tables['submissions']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        let query = supabase.from('submissions').select('*');
        
        if (assignmentId) {
          query = query.eq('assignment_id', assignmentId);
        } else if (studentId) {
          query = query.eq('student_id', studentId);
        }

        const { data, error } = await query.order('submitted_at', { ascending: false });

        if (error) throw error;
        setSubmissions(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId, studentId]);

  const createSubmission = async (submissionData: Tables['submissions']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert(submissionData)
        .select()
        .single();

      if (error) throw error;
      setSubmissions(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateSubmission = async (id: string, updates: Tables['submissions']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSubmissions(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { submissions, loading, error, createSubmission, updateSubmission };
};

// Grades
export const useGrades = (studentId?: string, teacherId?: string) => {
  const [grades, setGrades] = useState<Tables['grades']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        let query = supabase.from('grades').select('*');
        
        if (studentId) {
          query = query.eq('student_id', studentId);
        } else if (teacherId) {
          query = query.eq('teacher_id', teacherId);
        }

        const { data, error } = await query.order('graded_at', { ascending: false });

        if (error) throw error;
        setGrades(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [studentId, teacherId]);

  const createGrade = async (gradeData: Tables['grades']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .insert(gradeData)
        .select()
        .single();

      if (error) throw error;
      setGrades(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateGrade = async (id: string, updates: Tables['grades']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setGrades(prev => prev.map(g => g.id === id ? data : g));
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { grades, loading, error, createGrade, updateGrade };
};

// Study Sessions
export const useStudySessions = (studentId: string) => {
  const [sessions, setSessions] = useState<Tables['study_sessions']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSessions(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchSessions();
    }
  }, [studentId]);

  const createSession = async (sessionData: Tables['study_sessions']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;
      setSessions(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { sessions, loading, error, createSession };
};

// Notifications
export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Tables['notifications']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? data : n));
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const createNotification = async (notificationData: Tables['notifications']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) throw error;
      setNotifications(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { notifications, loading, error, markAsRead, createNotification };
};

// Interactions
export const useInteractions = (studentId: string) => {
  const [interactions, setInteractions] = useState<Tables['interactions']['Row'][]>([]);

  const trackInteraction = async (interactionData: Tables['interactions']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .insert(interactionData)
        .select()
        .single();

      if (error) throw error;
      setInteractions(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error tracking interaction:', err.message);
    }
  };

  return { interactions, trackInteraction };
};