import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Tag, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LearnContextPanelProps {
  entityId: string;
}

export const LearnContextPanel: React.FC<LearnContextPanelProps> = ({ entityId }) => {
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['learn-context', entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', entityId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded" />
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-5 w-5 text-green-400" />
        <h4 className="font-medium text-foreground">Learn Zone Context</h4>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-foreground mb-1">Lesson</h5>
          <p className="text-sm text-muted-foreground">{lesson.title}</p>
        </div>

        {lesson.archived_at && (
          <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 flex items-center gap-1">
            <Archive className="h-3 w-3" />
            Archived
          </Badge>
        )}

        <div>
          <h5 className="text-sm font-medium text-foreground mb-2">Content Preview</h5>
          <div className="glass-card p-3">
            <p className="text-xs text-muted-foreground line-clamp-3">
              {lesson.content}
            </p>
          </div>
        </div>

        {lesson.tags && lesson.tags.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Tags
            </h5>
            <div className="flex flex-wrap gap-1">
              {lesson.tags.slice(0, 4).map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {lesson.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{lesson.tags.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {lesson.source_bundle_id && (
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">Source Bundle</h5>
            <p className="text-xs text-muted-foreground font-mono">
              {lesson.source_bundle_id}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Created: {new Date(lesson.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};