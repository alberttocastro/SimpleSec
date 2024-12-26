# My Electron App

This is a simple Electron application built with TypeScript. It serves as a template for creating desktop applications using web technologies.

## Project Structure

```
my-electron-app
├── src
│   ├── main.ts        # Main entry point of the Electron application
│   ├── renderer.ts     # Renderer process managing the user interface
│   └── preload.ts      # Preload script for secure API exposure
├── package.json       # npm configuration file
├── tsconfig.json      # TypeScript configuration file
└── README.md          # Project documentation
```

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-electron-app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   npm start
   ```

## Scripts

- `npm start`: Starts the Electron application.
- `npm run build`: Compiles the TypeScript files.

## License

This project is licensed under the MIT License.