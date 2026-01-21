import axios from 'axios';
import { FakeData } from '@/types/accelerator';

const API_BASE = '';

export const fetchData = async (): Promise<FakeData> => {
  const response = await axios.get<FakeData>(`${API_BASE}/fakedata.json`);
  return response.data;
};

export const simulateLogin = async (email: string, password: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Accept any non-empty credentials for demo
  return email.length > 0 && password.length > 0;
};

export const simulateAction = async (action: string, targetId: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: `${action} executed successfully on ${targetId}`
  };
};
