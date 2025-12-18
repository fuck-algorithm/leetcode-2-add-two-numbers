import { useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-java'
import 'prismjs/themes/prism-tomorrow.css'
import { VariableState } from '../core/types'
import { CODE_LINES_ARRAY } from '../core/javaCode'
import './CodePanel.css'

interface CodePanelProps {
  currentLine: number
  variables: VariableState[]
}

export function CodePanel({ currentLine, variables }: CodePanelProps) {
  // 预先高亮所有代码行
  const highlightedLines = useMemo(() => {
    return CODE_LINES_ARRAY.map((line) => {
      // 保留前导空格，只高亮代码部分
      const leadingSpaces = line.match(/^(\s*)/)?.[1] || ''
      const codeContent = line.slice(leadingSpaces.length)
      const highlighted = codeContent
        ? Prism.highlight(codeContent, Prism.languages.java!, 'java')
        : ''
      return { leadingSpaces, highlighted, original: line }
    })
  }, [])

  // 根据行号获取该行的变量
  const getVariablesForLine = (lineNumber: number): VariableState[] => {
    return variables.filter((v) => v.line === lineNumber)
  }

  return (
    <div className="code-panel" data-testid="code-panel">
      <div className="code-header">
        <span className="code-language">Java</span>
      </div>
      <div className="code-container">
        <pre className="code-pre">
          {highlightedLines.map((lineData, index) => {
            const lineNumber = index + 1
            const isHighlighted = lineNumber === currentLine
            const lineVariables = getVariablesForLine(lineNumber)

            return (
              <div
                key={index}
                className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
                data-testid={`code-line-${lineNumber}`}
                data-highlighted={isHighlighted}
              >
                <span className="line-number">{lineNumber}</span>
                <code className="language-java">
                  <span className="leading-spaces">{lineData.leadingSpaces}</span>
                  <span dangerouslySetInnerHTML={{ __html: lineData.highlighted }} />
                </code>
                {lineVariables.length > 0 && (
                  <span className="variable-values" data-testid={`variables-line-${lineNumber}`}>
                    {lineVariables.map((v, i) => (
                      <span key={i} className={`variable-badge ${v.type}`}>
                        {v.name}: {v.value}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            )
          })}
        </pre>
      </div>
    </div>
  )
}
