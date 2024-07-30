export interface File {
  name: string;
  content: string;
}

interface Patterns {
  [key: string]: {
    [level: string]: string[];
  };
}

export function classifyRepo(language: string, files: File[]): { level: string; elements: string[] } {
  console.log(`Classifying ${language} with ${files.length} files`);
  if (!files || files.length === 0) {
    console.warn(`No files provided for ${language}`);
    return { level: "Unknown", elements: [] };
  }

  const patterns: Patterns = {
    javascript: {
      beginner: ['console.log', 'if', 'for', 'function', 'var'],
      intermediate: ['async', 'await', 'Promise', 'class', 'let', 'const', 'map', 'filter', 'reduce'],
      advanced: ['Proxy', 'Symbol', 'generator', 'WebAssembly', 'Worker', 'ServiceWorker']
    },
    python: {
      beginner: ['print(', 'if ', 'for ', 'def ', 'import ', 'class '],
      intermediate: ['lambda', 'list comprehension', 'decorator', '@classmethod', '@staticmethod', 'try:', 'except:'],
      advanced: ['metaclass', 'asyncio', 'yield from', 'contextlib', 'multiprocessing', 'numpy', 'pandas']
    },
    typescript: {
      beginner: ['interface', 'type', 'enum', 'as '],
      intermediate: ['generic', 'union', 'intersection', 'readonly', 'namespace'],
      advanced: ['conditional types', 'mapped types', 'decorators', 'abstract class']
    },
    java: {
      beginner: ['public class', 'System.out.println', 'if(', 'for(', 'while('],
      intermediate: ['implements', 'extends', 'try', 'catch', 'throw', 'ArrayList', 'HashMap'],
      advanced: ['synchronized', 'volatile', 'reflection', 'lambda', 'stream', 'CompletableFuture']
    },
    csharp: {
      beginner: ['Console.WriteLine', 'if(', 'for(', 'class ', 'using '],
      intermediate: ['async', 'await', 'LINQ', 'delegate', 'event', 'interface'],
      advanced: ['unsafe', 'fixed', 'stackalloc', 'reflection', 'Expression<T>', 'dynamic']
    },
    cpp: {
      beginner: ['cout', 'cin', 'if(', 'for(', 'class'],
      intermediate: ['template', 'namespace', 'try', 'catch', 'vector'],
      advanced: ['move semantics', 'SFINAE', 'constexpr', 'variadic templates']
    },
    php: {
      beginner: ['echo', 'if(', 'for(', 'function', '$_GET'],
      intermediate: ['try', 'catch', 'namespace', 'trait', 'PDO'],
      advanced: ['yield', 'closure', 'reflection', 'generator']
    },
    ruby: {
      beginner: ['puts', 'if ', 'def ', 'class ', 'attr_'],
      intermediate: ['module', 'yield', 'lambda', 'block', 'proc'],
      advanced: ['metaprogramming', 'eigenclass', 'method_missing']
    },
    go: {
      beginner: ['fmt.Println', 'if ', 'for ', 'func ', 'struct'],
      intermediate: ['goroutine', 'channel', 'interface{}', 'defer'],
      advanced: ['reflection', 'unsafe', 'cgo', 'context']
    },
    swift: {
      beginner: ['print(', 'if ', 'for ', 'func ', 'class'],
      intermediate: ['guard', 'enum', 'protocol', 'extension'],
      advanced: ['generics', '@propertyWrapper', 'async/await']
    },
    kotlin: {
      beginner: ['println(', 'if(', 'for(', 'fun ', 'class'],
      intermediate: ['coroutine', 'suspend', 'data class', 'companion object'],
      advanced: ['inline class', 'reified', 'crossinline', 'tailrec']
    },
    solidity: {
      beginner: ['contract', 'function', 'uint', 'address', 'mapping'],
      intermediate: ['modifier', 'event', 'require', 'assert', 'payable'],
      advanced: ['assembly', 'delegatecall', 'fallback', 'receive']
    }
  };

  const elements: string[] = [];
  let complexity = 0;

  for (const file of files) {
    console.log(`Processing file: ${file.name}`);
    if (file.content) {
      const content = file.content.toLowerCase();
      console.log(`File content length: ${content.length}`);
      for (const level in patterns[language]) {
        patterns[language][level].forEach(pattern => {
          if (content.includes(pattern.toLowerCase())) {
            console.log(`Found pattern: ${pattern} in file: ${file.name}`);
            if (!elements.includes(pattern)) {
              elements.push(pattern);
              complexity += level === 'beginner' ? 1 : level === 'intermediate' ? 5 : 10;
            }
          } else {
            console.log(`Pattern not found: ${pattern} in file: ${file.name}`);
          }
        });
      }
    } else {
      console.warn(`No content for file: ${file.name}`);
    }
  }

  let level = "Beginner";
  if (complexity >= 20) {
    level = "Advanced";
  } else if (complexity >= 10) {
    level = "Intermediate";
  }

  console.log(`Classification result: Level: ${level}, Elements: ${elements.join(', ')}`);
  return { level, elements };
}