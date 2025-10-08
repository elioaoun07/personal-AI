-- RLS Policies for Tasks App
-- Run this in Supabase SQL Editor to set up proper access control

-- Enable RLS on tasks table (if not already enabled)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow users to read their own tasks
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Allow users to insert their own tasks
CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow users to update their own tasks
CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy 4: Allow users to delete their own tasks
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
USING (auth.uid() = user_id);

-- Same for subtasks table
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subtasks of their tasks"
ON public.subtasks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tasks
    WHERE tasks.id = subtasks.task_id
    AND tasks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert subtasks to their tasks"
ON public.subtasks
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tasks
    WHERE tasks.id = subtasks.task_id
    AND tasks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update subtasks of their tasks"
ON public.subtasks
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.tasks
    WHERE tasks.id = subtasks.task_id
    AND tasks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete subtasks of their tasks"
ON public.subtasks
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.tasks
    WHERE tasks.id = subtasks.task_id
    AND tasks.user_id = auth.uid()
  )
);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('tasks', 'subtasks');
