import type { A2UIMessage } from '@easyops-cn/a2ui-react/0.8'

export interface Example {
  id: string
  title: string
  description: string
  messages: A2UIMessage[]
}

export const examples: Example[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Basic Text component demonstration',
    messages: [
      {
        surfaceUpdate: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: {
                Column: {
                  children: { explicitList: ['heading', 'text', 'button'] },
                  alignment: 'start',
                },
              },
            },
            {
              id: 'heading',
              component: {
                Text: {
                  text: { literalString: 'Hello, A2UI!' },
                  usageHint: 'h1',
                },
              },
            },
            {
              id: 'text',
              component: {
                Text: {
                  text: {
                    literalString:
                      'Welcome to the A2UI Playground. Edit the JSON on the left to see changes in real-time.',
                  },
                  usageHint: 'body',
                },
              },
            },
            {
              id: 'button',
              component: {
                Button: {
                  child: 'button-text',
                  primary: true,
                  action: {
                    name: 'hello-click',
                  },
                },
              },
            },
            {
              id: 'button-text',
              component: {
                Text: {
                  text: { literalString: 'Get Started' },
                },
              },
            },
          ],
        },
      },
      {
        beginRendering: {
          surfaceId: 'main',
          root: 'root',
        },
      },
    ],
  },
  {
    id: 'button-actions',
    title: 'Button Actions',
    description: 'Interactive Button with action handling',
    messages: [
      {
        surfaceUpdate: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: {
                Column: {
                  children: {
                    explicitList: ['heading', 'description', 'buttons'],
                  },
                },
              },
            },
            {
              id: 'heading',
              component: {
                Text: {
                  text: { literalString: 'Button Actions' },
                  usageHint: 'h2',
                },
              },
            },
            {
              id: 'description',
              component: {
                Text: {
                  text: {
                    literalString:
                      'Click the buttons below and check the browser console to see the dispatched actions.',
                  },
                  usageHint: 'body',
                },
              },
            },
            {
              id: 'buttons',
              component: {
                Row: {
                  children: { explicitList: ['btn-primary', 'btn-secondary'] },
                },
              },
            },
            {
              id: 'btn-primary',
              component: {
                Button: {
                  child: 'btn-primary-text',
                  primary: true,
                  action: {
                    name: 'button-click',
                    context: [
                      { key: 'button', value: { literalString: 'primary' } },
                    ],
                  },
                },
              },
            },
            {
              id: 'btn-primary-text',
              component: {
                Text: {
                  text: { literalString: 'Primary' },
                },
              },
            },
            {
              id: 'btn-secondary',
              component: {
                Button: {
                  child: 'btn-secondary-text',
                  primary: false,
                  action: {
                    name: 'button-click',
                    context: [
                      { key: 'button', value: { literalString: 'secondary' } },
                    ],
                  },
                },
              },
            },
            {
              id: 'btn-secondary-text',
              component: {
                Text: {
                  text: { literalString: 'Secondary' },
                },
              },
            },
          ],
        },
      },
      {
        beginRendering: {
          surfaceId: 'main',
          root: 'root',
        },
      },
    ],
  },
  {
    id: 'form-inputs',
    title: 'Form Inputs',
    description: 'TextField and Checkbox components',
    messages: [
      {
        surfaceUpdate: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: {
                Column: {
                  children: { explicitList: ['heading', 'form'] },
                },
              },
            },
            {
              id: 'heading',
              component: {
                Text: {
                  text: { literalString: 'Form Inputs' },
                  usageHint: 'h2',
                },
              },
            },
            {
              id: 'form',
              component: {
                Column: {
                  children: {
                    explicitList: ['name-field', 'email-field', 'checkbox'],
                  },
                },
              },
            },
            {
              id: 'name-field',
              component: {
                TextField: {
                  label: { literalString: 'Name' },
                  text: { path: 'form.name' },
                },
              },
            },
            {
              id: 'email-field',
              component: {
                TextField: {
                  label: { literalString: 'Email' },
                  text: { path: 'form.email' },
                },
              },
            },
            {
              id: 'checkbox',
              component: {
                CheckBox: {
                  label: { literalString: 'Subscribe to newsletter' },
                  value: { path: 'form.subscribe' },
                },
              },
            },
          ],
        },
      },
      {
        dataModelUpdate: {
          surfaceId: 'main',
          path: 'form',
          contents: [
            { key: 'name', valueString: '' },
            { key: 'email', valueString: '' },
            { key: 'subscribe', valueBoolean: false },
          ],
        },
      },
      {
        beginRendering: {
          surfaceId: 'main',
          root: 'root',
        },
      },
    ],
  },
  {
    id: 'data-binding',
    title: 'Data Binding',
    description: 'Components with ValueSource path bindings',
    messages: [
      {
        surfaceUpdate: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: {
                Column: {
                  children: {
                    explicitList: ['heading', 'description', 'input', 'output'],
                  },
                },
              },
            },
            {
              id: 'heading',
              component: {
                Text: {
                  text: { literalString: 'Data Binding Demo' },
                  usageHint: 'h2',
                },
              },
            },
            {
              id: 'description',
              component: {
                Text: {
                  text: {
                    literalString:
                      'Type in the input below and see the text update in real-time.',
                  },
                  usageHint: 'body',
                },
              },
            },
            {
              id: 'input',
              component: {
                TextField: {
                  label: { literalString: 'Your message' },
                  text: { path: 'message' },
                },
              },
            },
            {
              id: 'output',
              component: {
                Card: {
                  child: 'output-content',
                },
              },
            },
            {
              id: 'output-content',
              component: {
                Column: {
                  children: { explicitList: ['output-label', 'output-text'] },
                },
              },
            },
            {
              id: 'output-label',
              component: {
                Text: {
                  text: { literalString: 'You typed:' },
                  usageHint: 'caption',
                },
              },
            },
            {
              id: 'output-text',
              component: {
                Text: {
                  text: { path: 'message' },
                  usageHint: 'body',
                },
              },
            },
          ],
        },
      },
      {
        dataModelUpdate: {
          surfaceId: 'main',
          contents: [
            { key: 'message', valueString: 'Hello from data binding!' },
          ],
        },
      },
      {
        beginRendering: {
          surfaceId: 'main',
          root: 'root',
        },
      },
    ],
  },
]
