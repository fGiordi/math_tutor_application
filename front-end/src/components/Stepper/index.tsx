import React, { useState } from 'react';
import { TiTick } from 'react-icons/ti';

interface Stepper {
  steps: [];
}
const Stepper = ({ steps }: Stepper) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  return (
    <>
      <div className='flex justify-between'>
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && 'active'} ${
              (i + 1 < currentStep || complete) && 'complete'
            } `}
          >
            <div className='step'>
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className='text-sm text-gray-500'>{step}</p>
          </div>
        ))}
      </div>
      {steps.length > 0 && !complete && (
        <button
          className='btn ml-4 rounded-full bg-green-500 py-4 px-8 font-bold  text-gray-800 hover:underline'
          onClick={() => {
            currentStep === steps.length
              ? setComplete(true)
              : setCurrentStep((prev) => prev + 1);
          }}
        >
          {currentStep === steps.length ? 'Finish' : 'Next'}
        </button>
      )}
    </>
  );
};

export default Stepper;
