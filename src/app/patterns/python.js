export const pythonPatterns = {
    useAst: false, // Python might use a different AST parser
    beginner: {
      'def': content => content.includes('def'),
      'open': content => content.includes('open('),
      'with open': content => content.includes('with open('),
      'print': content => content.includes('print('),
      'if statement': content => /if\s+.*:/.test(content),
      // ... other beginner patterns
    },
    intermediate: {
      'list comprehension': content => /\[.*for.*in.*\]/.test(content),
      'decorator': content => /@\w+/.test(content),
      'context manager': content => /with\s+.*:/.test(content),
      'Flask': content => content.includes('Flask'),
      'Django': content => content.includes('Django'),
      'lambda': content => /lambda\s+.*:/.test(content),
      'try': content => /try:/.test(content),
      'except': content => /except:/.test(content),
      // ... other intermediate patterns
    },
    advanced: {
      'metaclass': content => /class.*\(metaclass=.*\):/.test(content),
      'asyncio': content => content.includes('import asyncio'),
      'numpy': content => content.includes('import numpy'),
      'pandas': content => content.includes('import pandas'),
      'TensorFlow': content => content.includes('import tensorflow'),
      'PyTorch': content => content.includes('import torch'),
      'multiprocessing': content => content.includes('import multiprocessing'),
      'generator': content => /yield\s+.*:/.test(content),
      // ... other advanced patterns
    }
};