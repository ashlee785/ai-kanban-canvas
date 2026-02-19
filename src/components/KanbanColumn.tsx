import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Column } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const columnColorMap: Record<string, string> = {
  'neon-blue': 'border-t-neon-blue',
  'neon-orange': 'border-t-neon-orange',
  'neon-purple': 'border-t-neon-purple',
  'neon-green': 'border-t-neon-green',
};

const dotColorMap: Record<string, string> = {
  'neon-blue': 'bg-neon-blue',
  'neon-orange': 'bg-neon-orange',
  'neon-purple': 'bg-neon-purple',
  'neon-green': 'bg-neon-green',
};

export function KanbanColumn({ column, tasks, onAddTask, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col min-w-[280px] max-w-[320px] w-full rounded-xl border border-border bg-card/50 backdrop-blur-sm border-t-2 ${columnColorMap[column.color]} transition-all ${isOver ? 'ring-1 ring-primary/50 bg-primary/5' : ''}`}
    >
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColorMap[column.color]}`} />
          <h3 className="font-display text-xs tracking-wider uppercase text-foreground">{column.title}</h3>
          <span className="text-[10px] text-muted-foreground font-body bg-secondary rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px] max-h-[calc(100vh-240px)]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground/50 font-body border border-dashed border-border/50 rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
    </motion.div>
  );
}
