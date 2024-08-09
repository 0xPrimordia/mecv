import { isHigherOrderComponent } from './javascriptHelpers';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export const javascriptPatterns = {
  useAst: true,
  parseOptions: {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  },
  astVisitors: {
    // Add AST visitors here if needed
  },
  beginner: {
    'module.exports': content => content.includes('module.exports'),
    'require': content => content.includes('require('),
    'http.createServer': content => content.includes('http.createServer'),
    'console.log': content => content.includes('console.log'),
    'function': content => content.includes('function'),
    'var': content => content.includes('var'),
    // ... other beginner patterns
  },
  intermediate: {
    'async/await': content => /async|await/.test(content),
    'Promise': content => content.includes('Promise'),
    'middleware': content => /middleware/.test(content),
    'class': content => /class/.test(content),
    'let': content => /let/.test(content),
    'const': content => /const/.test(content),
    'arrow function': content => /=>/.test(content),
    'map': content => /map/.test(content),
    'filter': content => /filter/.test(content),
    'reduce': content => /reduce/.test(content),
    // ... other intermediate patterns
  },
  advanced: {
    'Higher Order Component': (content, file) => {
      const ast = parse(content, javascriptPatterns.parseOptions);
      let isHOC = false;
      traverse(ast, {
        Function(path) {
          if (isHigherOrderComponent(path)) {
            isHOC = true;
            path.stop();
          }
        }
      });
      return isHOC;
    },
    'custom middleware': content => /function.*\(req,\s*res,\s*next\)/.test(content),
    'stream': content => /stream/.test(content),
    'performance optimization': content => /performance optimization/.test(content),
    'WebSocket': content => /WebSocket/.test(content),
    'Proxy': content => /Proxy/.test(content),
    'Reflect': content => /Reflect/.test(content),
    'Symbol': content => /Symbol/.test(content),
    // ... other advanced patterns
  }
};