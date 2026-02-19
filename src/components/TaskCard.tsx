import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, PRIORITY_COLORS } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group rounded-lg border border-border bg-card/80 p-3 cursor-grab active:cursor-grabbing transition-all hover:border-primary/40 hover:glow-green ${isDragging ? 'opacity-50 scale-105 z-50' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-body font-semibold text-sm text-foreground leading-tight flex-1">{task.title}</h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-1 hover:text-primary">
            <Edit2 size={12} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="p-1 hover:text-destructive">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 font-body">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5 items-center">
        <Badge className={`text-[10px] px-1.5 py-0 border ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </Badge>

        {task.category && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{task.category}</Badge>
        )}

        {task.tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
        {task.due_date && (
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {format(new Date(task.due_date), 'MMM d')}
          </span>
        )}
        {(task.time_spent_minutes ?? 0) > 0 && (
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {Math.floor((task.time_spent_minutes ?? 0) / 60)}h {(task.time_spent_minutes ?? 0) % 60}m
          </span>
        )}
      </div>
    </motion.div>
  );
}
