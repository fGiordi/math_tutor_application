import { create } from 'zustand';
import { toast } from 'react-toastify';

import axios from 'axios';

interface Result {
  steps: [];
  solution: string;
}

interface Calculate {
  equation: string | null;
  result: Result | null;
  solveEquation: (equation: string) => void;
}

const API = 'http://localhost:3030';

export const useCalculate = create<Calculate>((set) => ({
  equation: null,
  result: null,
  solveEquation: async (equation: string) => {
    try {
      const sendData = await axios.post(`${API}/calculate`, {
        equation: equation,
      });
      console.log('sendData', sendData);
      set({ result: sendData.data });
    } catch (error) {
      // @ts-ignore
      console.log('error on solve equation', error.message);
      toast('Error on solve equation', {
        type: 'error',
      });
    }
  },
}));
