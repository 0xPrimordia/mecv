import { javascriptPatterns } from '../patterns/javascript';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

describe('JavaScript Patterns', () => {
  describe('Higher Order Component Detection', () => {
    const hocDetector = javascriptPatterns.advanced['Higher Order Component'];

    it('should detect a Higher Order Component', () => {
      const code = `
        function withLogging(WrappedComponent) {
          return class extends React.Component {
            componentDidMount() {
              console.log('Component mounted');
            }
            render() {
              return <WrappedComponent {...this.props} />;
            }
          };
        }
      `;
      
      const ast = parse(code, javascriptPatterns.parseOptions);
      let result = false;
      traverse(ast, {
        Function(path) {
          if (hocDetector(code, { content: code })) {
            result = true;
          }
        }
      });

      expect(result).toBe(true);
    });

    it('should not detect a regular function as a Higher Order Component', () => {
      const code = `
        function regularFunction(param) {
          return param * 2;
        }
      `;
      
      const ast = parse(code, javascriptPatterns.parseOptions);
      let result = false;
      traverse(ast, {
        Function(path) {
          if (hocDetector(code, { content: code })) {
            result = true;
          }
        }
      });

      expect(result).toBe(false);
    });
  });
});