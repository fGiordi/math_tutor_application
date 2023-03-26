import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Link from 'next/link';
import { AiFillCalculator } from 'react-icons/ai';
import { useCalculate } from '@/store/api';
import { useForm, SubmitHandler } from 'react-hook-form';
import Stepper from '@/components/Stepper';

interface IFormInput {
  equation: string;
}

export default function TutorMe() {
  const [text, setText] = React.useState('');

  const { solveEquation, equation, result } = useCalculate();
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await solveEquation(data.equation);
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <section className='bg-indigo-600 dark:bg-gray-900'>
        <div className='mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0'>
          <div className='mr-auto place-self-center lg:col-span-7'>
            <h1 className='mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white dark:text-white md:text-5xl xl:text-6xl'>
              Maths Tutor Me
            </h1>
            <p className='0 mb-6 max-w-2xl font-light text-white dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl'>
              Maths Tutor Me(The Linear Equation Tutor) is a mobile application
              designed to help students master the basic skills needed to solve
              simple linear equations. The app features a step-by-step approach
              that guides students through the process of solving linear
              equations, providing feedback and explanations along the way.
            </p>
            <div className='mb-5'>
              <Link
                href='/'
                className='mr-3 inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900'
              >
                Home
                <svg
                  className='ml-2 -mr-1 h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                    clip-rule='evenodd'
                  ></path>
                </svg>
              </Link>
            </div>
            <label
              htmlFor='equation'
              className='sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Equation
            </label>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <AiFillCalculator size={20} className='h-8 w-8' />
                </div>
                <input
                  type='search'
                  id='search'
                  {...register('equation')}
                  className='ml-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  placeholder='Equation'
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  type='submit'
                  className='absolute right-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Calculate
                </button>
              </div>
            </form>
          </div>
          <div className='hidden lg:col-span-5 lg:mt-0 lg:flex'>
            <div className='mt-8 grid grid-cols-2 gap-4'>
              <img
                className='w-full rounded-lg'
                src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png'
                alt='office content 1'
              />
              <img
                className='mt-4 w-full rounded-lg lg:mt-10'
                src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png'
                alt='office content 2'
              />
            </div>
          </div>
        </div>
      </section>

      <div
        className='h-screen-1/2 w-screen text-white'
        style={{
          background:
            'linear-gradient(90deg, rgba(131, 126, 226, 1) 24%, rgba(114, 114, 226, 1) 58%, rgba(0, 212, 255, 1) 100%)',
        }}
      >
        <div className='container mx-auto flex flex-col items-center justify-center px-5 py-24'>
          <div className='w-full text-center '>
            <h1 className='my-4 text-5xl font-bold leading-tight'>
              Steps: {text}
            </h1>
            <p className='mb-8 text-2xl'>
              Step
              {result?.steps
                ? ` 1 - ${result?.steps.length}`
                : ` No steps found `}
            </p>
            <Stepper steps={result?.steps || []} />
            <div className='mx-auto mt-5 flex justify-center'>
              <button
                className='ml-4 rounded-full bg-white py-4 px-8 font-bold  text-gray-800 hover:underline'
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
