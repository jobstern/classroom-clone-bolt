/*
  # Schema inicial do sistema educacional

  1. Tabelas principais
    - `profiles` - Perfis de usuários (professores e alunos)
    - `classes` - Turmas criadas pelos professores
    - `class_enrollments` - Matrículas de alunos nas turmas
    - `assignments` - Atividades criadas pelos professores
    - `submissions` - Entregas dos alunos
    - `grades` - Notas atribuídas às entregas
    - `interactions` - Rastreamento de interações dos usuários
    - `self_regulation_tips` - Dicas de autorregulação
    - `tip_interactions` - Interações com as dicas
    - `notifications` - Sistema de notificações
    - `study_sessions` - Sessões de estudo dos alunos

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas específicas para professores e alunos
    - Controle de acesso granular por tipo de usuário

  3. Dados iniciais
    - Dicas padrão de autorregulação
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para tipos de usuário
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('teacher', 'student');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para status de atividades
DO $$ BEGIN
  CREATE TYPE assignment_status AS ENUM ('draft', 'active', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para tipos de atividades
DO $$ BEGIN
  CREATE TYPE assignment_type AS ENUM ('assignment', 'quiz', 'project', 'exam');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para prioridades
DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para status de submissões
DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('pending', 'submitted', 'graded', 'late');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para tipos de interação
DO $$ BEGIN
  CREATE TYPE interaction_type AS ENUM ('view', 'click', 'submit', 'download', 'popup_viewed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para categorias de dicas
DO $$ BEGIN
  CREATE TYPE tip_category AS ENUM ('time_management', 'focus', 'stress', 'motivation');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para gatilhos de dicas
DO $$ BEGIN
  CREATE TYPE tip_trigger AS ENUM ('time_spent', 'inactivity', 'deadline_approaching', 'low_engagement');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para tipos de notificação
DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('assignment', 'grade', 'reminder', 'system');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
  role user_role NOT NULL,
  phone TEXT,
  location TEXT,
  bio TEXT,
  birth_date DATE,
  institution TEXT,
  department TEXT,
  subjects TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de turmas
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'blue',
  section TEXT,
  room TEXT,
  code TEXT UNIQUE NOT NULL,
  schedule TEXT,
  semester TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de matrículas
CREATE TABLE IF NOT EXISTS class_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- Tabela de atividades
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  due_date DATE NOT NULL,
  due_time TIME NOT NULL,
  points INTEGER NOT NULL DEFAULT 100,
  priority priority_level DEFAULT 'medium',
  type assignment_type DEFAULT 'assignment',
  status assignment_status DEFAULT 'draft',
  attachments TEXT[],
  allow_late_submission BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de submissões
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments TEXT[],
  status submission_status DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  is_late BOOLEAN DEFAULT FALSE,
  UNIQUE(assignment_id, student_id)
);

-- Tabela de notas
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  grade DECIMAL(5,2) NOT NULL,
  max_points INTEGER NOT NULL,
  feedback TEXT,
  graded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de interações
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type interaction_type NOT NULL,
  target TEXT NOT NULL,
  duration INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de dicas de autorregulação
CREATE TABLE IF NOT EXISTS self_regulation_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category tip_category NOT NULL,
  trigger_type tip_trigger NOT NULL,
  trigger_value INTEGER NOT NULL,
  priority priority_level DEFAULT 'medium',
  frequency TEXT DEFAULT 'always',
  is_active BOOLEAN DEFAULT TRUE,
  conditions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de interações com dicas
CREATE TABLE IF NOT EXISTS tip_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tip_id UUID REFERENCES self_regulation_tips(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'viewed', 'dismissed', 'applied'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de sessões de estudo
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  duration INTEGER NOT NULL, -- em minutos
  focus_score INTEGER DEFAULT 50, -- 0-100
  notes TEXT,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_regulation_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (profiles.user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (profiles.user_id = auth.uid());

CREATE POLICY "Teachers can view student profiles in their classes" ON profiles
  FOR SELECT USING (
    profiles.role = 'student' AND profiles.id IN (
      SELECT ce.student_id FROM class_enrollments ce
      JOIN classes c ON c.id = ce.class_id
      JOIN profiles teacher_profile ON teacher_profile.id = c.teacher_id
      WHERE teacher_profile.user_id = auth.uid()
    )
  );

-- Políticas para classes
CREATE POLICY "Teachers can manage their classes" ON classes
  FOR ALL USING (
    classes.teacher_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their enrolled classes" ON classes
  FOR SELECT USING (
    classes.id IN (
      SELECT ce.class_id FROM class_enrollments ce
      JOIN profiles student_profile ON student_profile.id = ce.student_id
      WHERE student_profile.user_id = auth.uid()
    )
  );

-- Políticas para class_enrollments
CREATE POLICY "Teachers can manage enrollments in their classes" ON class_enrollments
  FOR ALL USING (
    class_enrollments.class_id IN (
      SELECT c.id FROM classes c
      JOIN profiles teacher_profile ON teacher_profile.id = c.teacher_id
      WHERE teacher_profile.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their enrollments" ON class_enrollments
  FOR SELECT USING (
    class_enrollments.student_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

-- Políticas para assignments
CREATE POLICY "Teachers can manage assignments in their classes" ON assignments
  FOR ALL USING (
    assignments.teacher_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view assignments in their classes" ON assignments
  FOR SELECT USING (
    assignments.class_id IN (
      SELECT ce.class_id FROM class_enrollments ce
      JOIN profiles student_profile ON student_profile.id = ce.student_id
      WHERE student_profile.user_id = auth.uid()
    )
  );

-- Políticas para submissions
CREATE POLICY "Students can manage their own submissions" ON submissions
  FOR ALL USING (
    submissions.student_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view submissions for their assignments" ON submissions
  FOR SELECT USING (
    submissions.assignment_id IN (
      SELECT a.id FROM assignments a
      JOIN profiles teacher_profile ON teacher_profile.id = a.teacher_id
      WHERE teacher_profile.user_id = auth.uid()
    )
  );

-- Políticas para grades
CREATE POLICY "Teachers can manage grades for their assignments" ON grades
  FOR ALL USING (
    grades.teacher_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own grades" ON grades
  FOR SELECT USING (
    grades.student_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

-- Políticas para interactions
CREATE POLICY "Students can manage their own interactions" ON interactions
  FOR ALL USING (
    interactions.student_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view interactions of their students" ON interactions
  FOR SELECT USING (
    interactions.student_id IN (
      SELECT ce.student_id FROM class_enrollments ce
      JOIN classes c ON c.id = ce.class_id
      JOIN profiles teacher_profile ON teacher_profile.id = c.teacher_id
      WHERE teacher_profile.user_id = auth.uid()
    )
  );

-- Políticas para self_regulation_tips
CREATE POLICY "Everyone can view active tips" ON self_regulation_tips
  FOR SELECT USING (self_regulation_tips.is_active = TRUE);

CREATE POLICY "Teachers can manage tips" ON self_regulation_tips
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'teacher'
    )
  );

-- Políticas para tip_interactions
CREATE POLICY "Students can manage their tip interactions" ON tip_interactions
  FOR ALL USING (
    tip_interactions.student_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

-- Políticas para notifications
CREATE POLICY "Users can manage their own notifications" ON notifications
  FOR ALL USING (
    notifications.user_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

-- Políticas para study_sessions
CREATE POLICY "Students can manage their own study sessions" ON study_sessions
  FOR ALL USING (
    study_sessions.student_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
    )
  );

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DO $$ BEGIN
  CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_self_regulation_tips_updated_at BEFORE UPDATE ON self_regulation_tips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Inserir dicas padrão de autorregulação
INSERT INTO self_regulation_tips (title, content, category, trigger_type, trigger_value) 
VALUES
('Técnica Pomodoro', 'Que tal fazer uma pausa? Você tem estudado por um tempo. A técnica Pomodoro sugere 25 minutos de foco seguidos de 5 minutos de descanso.', 'time_management', 'time_spent', 1500),
('Mantenha o Foco', 'Parece que você está inativo há um tempo. Que tal retomar seus estudos? Defina uma meta pequena para começar!', 'focus', 'inactivity', 600),
('Prazo Próximo', 'Atenção! Você tem uma atividade com prazo próximo. Organize seu tempo para concluí-la sem estresse.', 'stress', 'deadline_approaching', 1440),
('Você Consegue!', 'Continue assim! Cada pequeno progresso é uma vitória. Celebre suas conquistas e mantenha a motivação.', 'motivation', 'low_engagement', 30)
ON CONFLICT DO NOTHING;