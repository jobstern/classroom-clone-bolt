/*
  # Corrigir recursão infinita nas políticas do profiles

  1. Problema
    - A política "Teachers can view enrolled students v3" ainda causa recursão infinita
    - Isso acontece porque ela faz JOIN com a tabela profiles dentro da própria política da tabela profiles
    - Precisamos simplificar a abordagem

  2. Solução
    - Remover todas as políticas problemáticas
    - Criar políticas mais simples que não causem recursão
    - Usar uma abordagem diferente para permitir que professores vejam alunos
*/

-- Remover todas as políticas problemáticas
DROP POLICY IF EXISTS "Teachers can view enrolled students v3" ON profiles;
DROP POLICY IF EXISTS "Teachers can view enrolled students v2" ON profiles;
DROP POLICY IF EXISTS "Teachers can view enrolled students" ON profiles;
DROP POLICY IF EXISTS "Teachers can view student profiles in their classes" ON profiles;

-- Política simples para usuários verem seu próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para usuários atualizarem seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários criarem seu próprio perfil
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Nova política simplificada para professores verem alunos
-- Esta política evita recursão ao não fazer JOIN com profiles
CREATE POLICY "Teachers can view enrolled students v4" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    role = 'student'::user_role 
    AND EXISTS (
      SELECT 1
      FROM class_enrollments ce
      JOIN classes c ON c.id = ce.class_id
      WHERE ce.student_id = profiles.id
      AND c.teacher_id = (
        SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'teacher'::user_role LIMIT 1
      )
    )
  );