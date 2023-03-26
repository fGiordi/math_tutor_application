import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Link from 'next/link';

export default function HomePage() {
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
            <Link
              href='/tutor-me'
              className='mr-3 inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900'
            >
              Get started
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
            <a
              href='#'
              className='inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-white  hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800'
            >
              Contact Us
            </a>
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

      <section className='bg-white dark:bg-gray-900'>
        <div className='mx-auto max-w-screen-xl items-center gap-16 py-8 px-4 lg:grid  lg:py-10 lg:px-6'>
          <div className='flex grid-cols-4 flex-col gap-5 lg:grid'>
            <div className='font-light text-gray-500 dark:text-gray-400 sm:text-lg'>
              <h2 className='text-xxl mb-4 font-extrabold tracking-tight text-gray-900 dark:text-white'>
                Interactive examples:
              </h2>
              <p className='mb-4'>
                The app features a variety of interactive examples that
                demonstrate how to solve simple linear equations. These examples
                are designed to help students understand the basic concepts and
                steps involved in solving linear equations.
              </p>
            </div>
            <div className='font-light text-gray-500 dark:text-gray-400 sm:text-lg'>
              <h2 className='text-xxl mb-4 font-extrabold tracking-tight text-gray-900 dark:text-white'>
                Step-by-step guidance:
              </h2>
              <p className='mb-4'>
                The app provides step-by-step guidance for solving linear
                equations, breaking down each step into smaller, more manageable
                tasks. This helps students to understand the process and avoid
                getting stuck or confused. Practice problems: The app includes a
                selection of practice problems that students
              </p>
            </div>
            <div className='font-light text-gray-500 dark:text-gray-400 sm:text-lg'>
              <h2 className='text-xxl mb-4 font-extrabold tracking-tight text-gray-900 dark:text-white'>
                Practice problems:
              </h2>
              <p className='mb-4'>
                The app includes a selection of practice problems that students
                can use to test their understanding and reinforce their skills.
                The problems are randomized and cover a range of difficulty
                levels, so students can challenge themselves and track their
                progress.
              </p>
            </div>
            <div className='font-light text-gray-500 dark:text-gray-400 sm:text-lg'>
              <h2 className='text-xxl mb-4 font-extrabold tracking-tight text-gray-900 dark:text-white'>
                Feedback and explanations:
              </h2>
              <p className='mb-4'>
                The app provides instant feedback on students' answers,
                highlighting errors and providing explanations for why certain
                steps are necessary. This helps students to learn from their
                mistakes and avoid repeating them in the future.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
