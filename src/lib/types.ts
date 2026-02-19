export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  category: string | null;
  tags: string[] | null;
  time_spent_minutes: number | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  icon: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To-Do', color: 'neon-blue', icon: '📋' },
  { id: 'in_progress', title: 'In Progress', color: 'neon-orange', icon: '🔧' },
  { id: 'review', title: 'Review', color: 'neon-purple', icon: '🔍' },
  { id: 'completed', title: 'Completed', color: 'neon-green', icon: '✅' },
];

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
  medium: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  high: 'bg-neon-orange/20 text-neon-orange border-neon-orange/30',
  urgent: 'bg-neon-red/20 text-neon-red border-neon-red/30',
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
