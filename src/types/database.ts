export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assignments: {
        Row: {
          id: string
          class_id: string
          teacher_id: string
          title: string
          description: string
          instructions: string | null
          due_date: string
          due_time: string
          points: number
          priority: 'low' | 'medium' | 'high'
          type: 'assignment' | 'quiz' | 'project' | 'exam'
          status: 'draft' | 'active' | 'closed'
          attachments: string[] | null
          allow_late_submission: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          teacher_id: string
          title: string
          description: string
          instructions?: string | null
          due_date: string
          due_time: string
          points?: number
          priority?: 'low' | 'medium' | 'high'
          type?: 'assignment' | 'quiz' | 'project' | 'exam'
          status?: 'draft' | 'active' | 'closed'
          attachments?: string[] | null
          allow_late_submission?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          teacher_id?: string
          title?: string
          description?: string
          instructions?: string | null
          due_date?: string
          due_time?: string
          points?: number
          priority?: 'low' | 'medium' | 'high'
          type?: 'assignment' | 'quiz' | 'project' | 'exam'
          status?: 'draft' | 'active' | 'closed'
          attachments?: string[] | null
          allow_late_submission?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      class_enrollments: {
        Row: {
          id: string
          class_id: string
          student_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          enrolled_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          teacher_id: string
          name: string
          subject: string
          description: string | null
          color: string
          section: string | null
          room: string | null
          code: string
          schedule: string | null
          semester: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          name: string
          subject: string
          description?: string | null
          color?: string
          section?: string | null
          room?: string | null
          code: string
          schedule?: string | null
          semester?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          name?: string
          subject?: string
          description?: string | null
          color?: string
          section?: string | null
          room?: string | null
          code?: string
          schedule?: string | null
          semester?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      grades: {
        Row: {
          id: string
          submission_id: string
          assignment_id: string
          student_id: string
          teacher_id: string
          grade: number
          max_points: number
          feedback: string | null
          graded_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          assignment_id: string
          student_id: string
          teacher_id: string
          grade: number
          max_points: number
          feedback?: string | null
          graded_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          assignment_id?: string
          student_id?: string
          teacher_id?: string
          grade?: number
          max_points?: number
          feedback?: string | null
          graded_at?: string
        }
      }
      interactions: {
        Row: {
          id: string
          student_id: string
          type: 'view' | 'click' | 'submit' | 'download' | 'popup_viewed'
          target: string
          duration: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          type: 'view' | 'click' | 'submit' | 'download' | 'popup_viewed'
          target: string
          duration?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          type?: 'view' | 'click' | 'submit' | 'download' | 'popup_viewed'
          target?: string
          duration?: number | null
          metadata?: Json | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'assignment' | 'grade' | 'reminder' | 'system'
          is_read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'assignment' | 'grade' | 'reminder' | 'system'
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'assignment' | 'grade' | 'reminder' | 'system'
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          name: string
          avatar: string
          role: 'teacher' | 'student'
          phone: string | null
          location: string | null
          bio: string | null
          birth_date: string | null
          institution: string | null
          department: string | null
          subjects: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          name: string
          avatar?: string
          role: 'teacher' | 'student'
          phone?: string | null
          location?: string | null
          bio?: string | null
          birth_date?: string | null
          institution?: string | null
          department?: string | null
          subjects?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          name?: string
          avatar?: string
          role?: 'teacher' | 'student'
          phone?: string | null
          location?: string | null
          bio?: string | null
          birth_date?: string | null
          institution?: string | null
          department?: string | null
          subjects?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      self_regulation_tips: {
        Row: {
          id: string
          title: string
          content: string
          category: 'time_management' | 'focus' | 'stress' | 'motivation'
          trigger_type: 'time_spent' | 'inactivity' | 'deadline_approaching' | 'low_engagement'
          trigger_value: number
          priority: 'low' | 'medium' | 'high'
          frequency: string
          is_active: boolean
          conditions: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: 'time_management' | 'focus' | 'stress' | 'motivation'
          trigger_type: 'time_spent' | 'inactivity' | 'deadline_approaching' | 'low_engagement'
          trigger_value: number
          priority?: 'low' | 'medium' | 'high'
          frequency?: string
          is_active?: boolean
          conditions?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: 'time_management' | 'focus' | 'stress' | 'motivation'
          trigger_type?: 'time_spent' | 'inactivity' | 'deadline_approaching' | 'low_engagement'
          trigger_value?: number
          priority?: 'low' | 'medium' | 'high'
          frequency?: string
          is_active?: boolean
          conditions?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          student_id: string
          subject: string
          duration: number
          focus_score: number
          notes: string | null
          session_date: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          subject: string
          duration: number
          focus_score?: number
          notes?: string | null
          session_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          subject?: string
          duration?: number
          focus_score?: number
          notes?: string | null
          session_date?: string
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          content: string
          attachments: string[] | null
          status: 'pending' | 'submitted' | 'graded' | 'late'
          submitted_at: string
          is_late: boolean
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          content: string
          attachments?: string[] | null
          status?: 'pending' | 'submitted' | 'graded' | 'late'
          submitted_at?: string
          is_late?: boolean
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          content?: string
          attachments?: string[] | null
          status?: 'pending' | 'submitted' | 'graded' | 'late'
          submitted_at?: string
          is_late?: boolean
        }
      }
      tip_interactions: {
        Row: {
          id: string
          tip_id: string
          student_id: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          tip_id: string
          student_id: string
          action: string
          created_at?: string
        }
        Update: {
          id?: string
          tip_id?: string
          student_id?: string
          action?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      assignment_status: 'draft' | 'active' | 'closed'
      assignment_type: 'assignment' | 'quiz' | 'project' | 'exam'
      interaction_type: 'view' | 'click' | 'submit' | 'download' | 'popup_viewed'
      notification_type: 'assignment' | 'grade' | 'reminder' | 'system'
      priority_level: 'low' | 'medium' | 'high'
      submission_status: 'pending' | 'submitted' | 'graded' | 'late'
      tip_category: 'time_management' | 'focus' | 'stress' | 'motivation'
      tip_trigger: 'time_spent' | 'inactivity' | 'deadline_approaching' | 'low_engagement'
      user_role: 'teacher' | 'student'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}