import { AskAIWidget, type WidgetTexts } from 'open-ask-ai'
import 'open-ask-ai/styles.css'

const exampleQuestions = [
  'What is A2UI SDK?',
  'How do I integrate A2UI SDK?',
  'Show me an example of using the A2UI SDK',
  'How can I customize components when using the A2UI SDK?',
]

const texts: WidgetTexts = {
  welcomeMessage: 'Ask me about A2UI SDK',
}

export interface AskAIProps {
  theme: 'light' | 'dark'
}

export function AskAI({ theme }: AskAIProps) {
  return (
    <AskAIWidget
      theme={theme}
      apiUrl="https://lab.shenwei.xyz"
      texts={texts}
      exampleQuestions={exampleQuestions}
    />
  )
}
