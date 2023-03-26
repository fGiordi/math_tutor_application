## About

This is the backend for the Maths equation tutor. We are required to write an application that solves for equations 2x - 2 = 10 and 2(4x + 3) + 6= 9 - 4x and provides the steps for solving the equation.

## How the application works

You should be able to input the equation into the application and, expect to be given steps on how to solve the equation.

- You can send through the following example: 2(4x + 3) + 6= 9 - 4x
- You will be given the steps on how to solve the equation:

## Please Note:

- If you are going to switch the variable from x to y or any other letter, ensure that its consistent on the RHS if you intend to use a variable on both sides as this is not factored into use case, however, I have an error check that will handle this and output to the user the relevant message if there is inconsistent variables sent through

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

4. Ensure you have an http client tool installed like [POSTMAN](https://www.postman.com/) or [ThunderClient](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)
   ```
   I use Thunder client, because you can install it on VSCODE and never need to leave the applciation to test the API.
   Once you have this tool ensure your server is running: and go to the http://localhost:3030/calculate endpoint.
   We are sending a post request with the following payload example:
   {
   "equation": "2(4y + 3) + 6 = 10 + 2y"
   }
   or
   {
    "equation": "3x + 2 = 9 - 4x"
   }
   Use any of the Equations Tested samples below to see what you can do with this API
   ```

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

### Which tests should be run:

    ```
    Case: Solve for 2x + 13 = 5 should return -4
    Case: Solve 3x + 2 = 9 - 4x should return 1
    Case: Solve 4x + 12 = 2x should return - 6
    Case: Solve 2(4x + 3) + 6 = 2x + 2 should return x = -1.667"
    Case: Solve 3(4x + 3) + 6 = 39 should return x = 2"
    Case: returns an error for an invalid algebraic expression for 10x + 6x + 4x

    Case: POST /calculate service returns steps and solution expression inside result object
    Case: Test variables consisency on LHS and RHS

    ```

# Equations Tested:

    - 2(4x + 3) + 6= 9 - 4x
    - 3x + 2 = 9 - 4x
    - 2x - 2 = 10
    - 2(4x + 3) + 6 = 2x + 2
    - 2(4y + 3) + 6= 9 - 4y
    - 2(4x + 3) + 6 = 10
    - 4x + 3 = 2x
    - 7x - 2 = 10x
    - 3(4x + 3) + 6 = 39 + 2x
