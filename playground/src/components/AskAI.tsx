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
      systemPrompt="You are a documentation assistant for A2UI SDK. Be concise and accurate. Output in markdown format, use proper formatting such as inline code when referring to code elements. Use the user's language for responses."
    />
  )
}
