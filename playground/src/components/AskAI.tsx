import { AskAIWidget } from 'open-ask-ai'

const exampleQuestions = [
  'What is A2UI SDK?',
  'How do I integrate A2UI SDK?',
  'Show me an example of using the A2UI SDK',
  'How can I customize components when using the A2UI SDK?',
]

export interface AskAIProps {
  theme: 'light' | 'dark'
}

export function AskAI({ theme }: AskAIProps) {
  return (
    <AskAIWidget
      theme={theme}
      apiUrl="https://lab.shenwei.xyz"
      exampleQuestions={exampleQuestions}
      systemPrompt="You are a documentation assistant for A2UI SDK. Answer based only on the provided documentation files in the current directory. When you don't have knowledge about the user question, always try to find and read relevant doc files in the current directory first.\n\nRules:\n- Never mention file paths or directories. Use documentation URLs from frontmatter as resource links at the end.\n- Output in markdown, use proper formatting such as inline code when referring to code elements.\n- Use the user's language."
    />
  )
}
