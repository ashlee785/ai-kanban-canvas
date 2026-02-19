import { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners, DragOverlay } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskDialog } from '@/components/TaskDialog';
import { AIChatbot } from '@/components/AIChatbot';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Task, TaskStatus, COLUMNS } from '@/lib/types';
import { LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import autoknerdLogo from '@/assets/autoknerd-logo.png';

const Board = () => {
  const { tasks, isLoading, createTask, updateTask, deleteTask, moveTask } = useTasks();
  const { user, signOut } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], in_progress: [], review: [], completed: [] };
    tasks.forEach(t => map[t.status]?.push(t));
    Object.values(map).forEach(arr => arr.sort((a, b) => a.position - b.position));
    return map;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    // handled in dragEnd
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Determine target column
    let targetStatus: TaskStatus;
    const overTask = tasks.find(t => t.id === over.id);
    if (overTask) {
      targetStatus = overTask.status;
    } else {
      targetStatus = over.id as TaskStatus;
    }

    if (!['todo', 'in_progress', 'review', 'completed'].includes(targetStatus)) return;

    const targetTasks = tasksByStatus[targetStatus].filter(t => t.id !== taskId);
    let newPosition = targetTasks.length;

    if (overTask && overTask.id !== taskId) {
      const overIndex = targetTasks.findIndex(t => t.id === overTask.id);
      newPosition = overIndex >= 0 ? overIndex : targetTasks.length;
    }

    moveTask.mutate({ id: taskId, status: targetStatus, position: newPosition });
  };

  const handleAddTask = (status: string) => {
    setEditingTask(null);
    setDefaultStatus(status as TaskStatus);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSave = (taskData: Partial<Task>) => {
    if (taskData.id) {
      updateTask.mutate(taskData as Partial<Task> & { id: string });
    } else {
      createTask.mutate(taskData);
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <img src={autoknerdLogo} alt="AutoKnerd" className="h-8" />
            <div>
              <h1 className="font-display text-sm tracking-wider text-primary text-glow-green">KANBAN BOARD</h1>
              <p className="text-[10px] text-muted-foreground font-body">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => handleAddTask('todo')} size="sm" className="font-display text-xs glow-green">
              <Plus size={14} /> New Task
            </Button>
            <Button onClick={signOut} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 p-6 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse-glow w-8 h-8 rounded-full bg-primary/20 border border-primary/50" />
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 min-h-[calc(100vh-140px)]">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={tasksByStatus[col.id]}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={(id) => deleteTask.mutate(id)}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTask && (
                <div className="rounded-lg border border-primary/50 bg-card p-3 glow-green opacity-90 rotate-2 w-[280px]">
                  <h4 className="font-body font-semibold text-sm">{activeTask.title}</h4>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSave={handleSave}
      />

      <AIChatbot />
    </div>
  );
};

export default Board;
