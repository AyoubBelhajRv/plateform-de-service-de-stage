export interface Task {
    id: number;
    subject: string;
    priority: string;
    startDate: Date;
    dueDate: Date;
    status: string;
  }
  // Your data array
  export const yourDataArray: Task[] = [
    {
      id: 1,
      subject: 'Task 1',
      priority: 'High',
      startDate: new Date('2024-03-15'),
      dueDate: new Date('2024-03-20'),
      status: 'In Progress'
    },
    {
      id: 2,
      subject: 'Task 2',
      priority: 'Medium',
      startDate: new Date('2024-03-16'),
      dueDate: new Date('2024-03-25'),
      status: 'Pending'
    },
    {
      id: 3,
      subject: 'Task 3',
      priority: 'High',
      startDate: new Date('2024-03-15'),
      dueDate: new Date('2024-03-20'),
      status: 'Completed'
    },
    {
      id: 4,
      subject: 'Task 4',
      priority: 'Medium',
      startDate: new Date('2024-03-16'),
      dueDate: new Date('2024-03-25'),
      status: 'To do'
    }
    // Add more tasks as needed
  ];