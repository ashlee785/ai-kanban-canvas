import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Task, TaskStatus, TaskPriority } from '@/lib/types';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
  onSave: (task: Partial<Task>) => void;
}

export function TaskDialog({ open, onOpenChange, task, defaultStatus = 'todo', onSave }: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.due_date || '');
      setCategory(task.category || '');
      setTagsInput(task.tags?.join(', ') || '');
      setTimeSpent(task.time_spent_minutes || 0);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus(defaultStatus);
      setDueDate('');
      setCategory('');
      setTagsInput('');
      setTimeSpent(0);
    }
  }, [task, defaultStatus, open]);

  const handleSave = () => {
    if (!title.trim()) return;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({
      ...(task ? { id: task.id } : {}),
      title: title.trim(),
      description,
      priority,
      status,
      due_date: dueDate || null,
      category: category || null,
      tags: tags.length > 0 ? tags : null,
      time_spent_minutes: timeSpent,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass neon-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-primary">{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-body">Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" className="bg-secondary/50" />
          </div>
          <div>
            <Label className="text-xs font-body">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your task..." className="bg-secondary/50 min-h-[60px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-body">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-body">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To-Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-body">Due Date</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs font-body">Time Spent (min)</Label>
              <Input type="number" value={timeSpent} onChange={e => setTimeSpent(+e.target.value)} className="bg-secondary/50" min={0} />
            </div>
          </div>
          <div>
            <Label className="text-xs font-body">Category</Label>
            <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Frontend" className="bg-secondary/50" />
          </div>
          <div>
            <Label className="text-xs font-body">Tags (comma separated)</Label>
            <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="bug, feature, ui" className="bg-secondary/50" />
          </div>
          <Button onClick={handleSave} className="w-full font-display glow-green">
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
