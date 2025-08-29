'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  totalMeals: number;
  attendanceRate: number;
  dueAmount: number;
  lastPayment: string;
}

const defaultStats: DashboardStats = {
  totalMeals: 0,
  attendanceRate: 0,
  dueAmount: 0,
  lastPayment: '-',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);

  const attendanceData = [
    { name: 'Breakfast', present: 23, absent: 7 },
    { name: 'Dinner', present: 25, absent: 5 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Meals
          </h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalMeals}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Attendance Rate
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {stats.attendanceRate.toFixed(1)}%
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Due Amount
          </h3>
          <p className="mt-2 text-3xl font-bold">₹{stats.dueAmount}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Last Payment
          </h3>
          <p className="mt-2 text-3xl font-bold">{stats.lastPayment}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Attendance</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="hsl(var(--primary))" name="Present" />
              <Bar dataKey="absent" fill="hsl(var(--muted))" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}