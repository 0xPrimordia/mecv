
export function isHigherOrderComponent(path) {
    // Check if the function returns a function or class
    const body = path.get('body');
    if (!body.isBlockStatement()) return false;
  
    const returnStatement = body.get('body').find(statement => statement.isReturnStatement());
    if (!returnStatement) return false;
  
    const returnValue = returnStatement.get('argument');
  
    // Check if it returns a function
    if (returnValue.isFunctionExpression() || returnValue.isArrowFunctionExpression()) {
      return true;
    }
  
    // Check if it returns a class that extends React.Component
    if (returnValue.isClassExpression()) {
      const superClass = returnValue.get('superClass');
      if (superClass.isMemberExpression() && 
          superClass.get('object').isIdentifier({ name: 'React' }) && 
          superClass.get('property').isIdentifier({ name: 'Component' })) {
        return true;
      }
    }
  
    return false;
  }