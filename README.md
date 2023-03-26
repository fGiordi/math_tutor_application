## About

This is the backend for the Maths equation tutor. We are required to write an application that solves for equations 2x - 2 = 10 and 2(4x + 3) + 6= 9 - 4x and provides the steps for solving the equation.

## How the application works

You should be able to input the equation into the application and, expect to be given steps on how to solve the equation.

- You can send through the following example: 2(4x + 3) + 6= 9 - 4x
- You will be given the steps on how to solve the equation:

## Please Note:

- If you are going to switch the variable from x to y or any other letter, ensure that its consistent on the RHS if you intend to use a variable on both sides as this is not factored into use case, however, I have check that will handle this and output to the user to stick to a consitent format.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

   ```
   cd path/to/back-end
   npm install
   ```

3. Start your app

   ```
   npm start
   ```

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

# Equations Tested:

    - 2(4x + 3) + 6= 9 - 4x
    - 3x + 2 = 9 - 4x
    - 2x - 2 = 10
    - 2(4x + 3) + 6 = 2x + 2
    - 2(4y + 3) + 6= 9 - 4y
    - 2(4x + 3) + 6 = 10
    - 4x + 3 = 2x
    - 7x - 2 = 10x
