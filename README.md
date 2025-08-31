# BlockNote Editor with shadcn/ui

A modern React rich text editor built with BlockNote and styled with shadcn/ui components.

## Features

- **Rich Text Editing**: Full-featured rich text editor with BlockNote
- **Modern UI**: Beautiful interface built with shadcn/ui components
- **Custom Inline Elements**: Support for custom inline button elements
- **Markdown Support**: Automatic conversion of markdown syntax to rich elements
- **Document Management**: Save, load, and clear document functionality
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **BlockNote** - Rich text editor framework
- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Usage

### Basic Editing

- Type normally to create paragraphs
- Use `/` commands to create different block types
- Drag and drop to rearrange blocks
- Use Tab and Shift+Tab for indentation

### Custom Inline Buttons

- Type `[Button Text]` to automatically create inline buttons
- Use the "Insert Button" button to add buttons programmatically
- Buttons are styled with a blue background and white text

### Document Management

- **Save**: Click "Save Document" to download your document as JSON
- **Load**: Click "Load Document" to upload a previously saved document
- **Clear**: Click "Clear Content" to remove all content

## Component Structure

The application uses shadcn/ui components for a consistent and modern look:

- **Button**: Various button variants (outline, destructive, secondary)
- **Input**: Text input for document naming
- **Card**: Container components for layout structure

## Styling

The application uses Tailwind CSS with custom CSS variables for theming:

- Light and dark mode support
- Consistent spacing and typography
- Responsive breakpoints
- Custom color palette

## Development

### Building for Production

```bash
npm run build
```

### Code Structure

- `src/App.tsx` - Main application component
- `src/components/ui/` - shadcn/ui components
- `src/lib/utils.ts` - Utility functions
- `src/styles/` - Custom CSS styles

## Dependencies

### Core

- `@blocknote/core` - BlockNote core functionality
- `@blocknote/react` - React integration
- `@blocknote/shadcn` - shadcn/ui integration

### UI Components

- `@radix-ui/react-slot` - Radix UI primitives
- `class-variance-authority` - Component variant management
- `clsx` - Conditional class names
- `tailwind-merge` - Tailwind class merging
- `lucide-react` - Icon library

### Build Tools

- `vite` - Build tool and dev server
- `tailwindcss` - CSS framework
- `postcss` - CSS processing
- `autoprefixer` - CSS vendor prefixing

## License

MIT
