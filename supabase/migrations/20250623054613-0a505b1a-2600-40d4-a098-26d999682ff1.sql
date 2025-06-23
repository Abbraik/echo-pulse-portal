
-- Create a table for tasks
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID REFERENCES public.bundles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'to-do' CHECK (status IN ('to-do', 'in-progress', 'completed')),
  assignee TEXT NOT NULL,
  assignee_avatar TEXT,
  assignee_initial TEXT,
  due_date DATE,
  needs_approval BOOLEAN NOT NULL DEFAULT false,
  teams_chat_history JSONB DEFAULT '[]'::jsonb,
  dependencies TEXT[] DEFAULT '{}',
  gantt_start INTEGER DEFAULT 0,
  gantt_duration INTEGER DEFAULT 7,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view all tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
