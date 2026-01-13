import type { A2UIMessage } from '@easyops-cn/a2ui-react/0.9'

export interface ExampleV09 {
  id: string
  title: string
  description: string
  group?: string
  messages: A2UIMessage[]
}

export const examplesV09: ExampleV09[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Basic Text component demonstration',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'text', 'button'],
              align: 'start',
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Hello, A2UI 0.9!',
              variant: 'h1',
            },
            {
              id: 'text',
              component: 'Text',
              text: 'Welcome to the A2UI 0.9 React Renderer Playground. This version uses a simplified component structure with direct values instead of ValueSource wrappers.',
              variant: 'body',
            },
            {
              id: 'button',
              component: 'Button',
              child: 'button-text',
              primary: true,
              action: {
                name: 'hello-click',
              },
            },
            {
              id: 'button-text',
              component: 'Text',
              text: 'Get Started',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'data-binding',
    title: 'Data Binding',
    description: 'Components with path bindings and two-way form binding',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'description', 'input', 'output'],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Data Binding Demo',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'Type in the input below and see the text update in real-time.',
              variant: 'body',
            },
            {
              id: 'input',
              component: 'TextField',
              label: 'Your message',
              value: { path: '/message' },
            },
            {
              id: 'output',
              component: 'Card',
              child: 'output-content',
            },
            {
              id: 'output-content',
              component: 'Column',
              children: ['output-label', 'output-text'],
            },
            {
              id: 'output-label',
              component: 'Text',
              text: 'You typed:',
              variant: 'caption',
            },
            {
              id: 'output-text',
              component: 'Text',
              text: { path: '/message' },
              variant: 'body',
            },
          ],
        },
      },
      {
        updateDataModel: {
          surfaceId: 'main',
          path: '/message',
          value: 'Hello from data binding!',
        },
      },
    ],
  },
  {
    id: 'form-inputs',
    title: 'Form Inputs',
    description: 'TextField and CheckBox components with validation',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'form', 'submit-btn'],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Form Inputs',
              variant: 'h2',
            },
            {
              id: 'form',
              component: 'Column',
              children: ['name-field', 'email-field', 'checkbox'],
            },
            {
              id: 'name-field',
              component: 'TextField',
              label: 'Name',
              value: { path: '/form/name' },
              checks: [
                {
                  message: 'Name is required',
                  call: 'isNotEmpty',
                  args: { value: { path: '/form/name' } },
                },
              ],
            },
            {
              id: 'email-field',
              component: 'TextField',
              label: 'Email',
              value: { path: '/form/email' },
            },
            {
              id: 'checkbox',
              component: 'CheckBox',
              label: 'Subscribe to newsletter',
              value: { path: '/form/subscribe' },
            },
            {
              id: 'submit-btn',
              component: 'Button',
              child: 'submit-text',
              primary: true,
              action: {
                name: 'submit-form',
                context: {
                  name: { path: '/form/name' },
                  email: { path: '/form/email' },
                  subscribe: { path: '/form/subscribe' },
                },
              },
              checks: [
                {
                  message: 'Name is required',
                  call: 'isNotEmpty',
                  args: { value: { path: '/form/name' } },
                },
              ],
            },
            {
              id: 'submit-text',
              component: 'Text',
              text: 'Submit',
            },
          ],
        },
      },
      {
        updateDataModel: {
          surfaceId: 'main',
          path: '/form',
          value: {
            name: '',
            email: '',
            subscribe: false,
          },
        },
      },
    ],
  },
  {
    id: 'template-binding',
    title: 'Template Binding',
    description: 'Dynamic children using template binding from data model',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'description', 'items-list'],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Template Binding Demo',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'This list is generated dynamically from the data model using template binding.',
              variant: 'body',
            },
            {
              id: 'items-list',
              component: 'Column',
              children: {
                componentId: 'item-template',
                path: '/items',
              },
            },
            {
              id: 'item-template',
              component: 'Card',
              child: 'item-content',
            },
            {
              id: 'item-content',
              component: 'Row',
              children: ['item-icon', 'item-text'],
              align: 'center',
            },
            {
              id: 'item-icon',
              component: 'Icon',
              name: { path: 'icon' },
            },
            {
              id: 'item-text',
              component: 'Text',
              text: { path: 'name' },
              variant: 'body',
            },
          ],
        },
      },
      {
        updateDataModel: {
          surfaceId: 'main',
          path: '/items',
          value: [
            { name: 'Home', icon: 'home' },
            { name: 'Settings', icon: 'settings' },
            { name: 'User Profile', icon: 'accountCircle' },
            { name: 'Search', icon: 'search' },
          ],
        },
      },
    ],
  },
  {
    id: 'button-actions',
    title: 'Button Actions',
    description: 'Interactive Button with action context',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'description', 'buttons'],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Button Actions',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'Click the buttons below and check the browser console to see the dispatched actions.',
              variant: 'body',
            },
            {
              id: 'buttons',
              component: 'Row',
              children: ['btn-primary', 'btn-secondary'],
            },
            {
              id: 'btn-primary',
              component: 'Button',
              child: 'btn-primary-text',
              primary: true,
              action: {
                name: 'button-click',
                context: {
                  button: 'primary',
                  timestamp: { path: '/currentTime' },
                },
              },
            },
            {
              id: 'btn-primary-text',
              component: 'Text',
              text: 'Primary',
            },
            {
              id: 'btn-secondary',
              component: 'Button',
              child: 'btn-secondary-text',
              primary: false,
              action: {
                name: 'button-click',
                context: {
                  button: 'secondary',
                },
              },
            },
            {
              id: 'btn-secondary-text',
              component: 'Text',
              text: 'Secondary',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'choice-picker',
    title: 'Choice Picker',
    description: 'ChoicePicker component for single and multiple selection',
    group: 'Components',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: [
                'heading',
                'description',
                'single-label',
                'single-select',
                'multi-label',
                'multi-select',
              ],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Choice Picker Component',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'Select one or multiple options. ChoicePicker replaces MultipleChoice in v0.9.',
              variant: 'body',
            },
            {
              id: 'single-label',
              component: 'Text',
              text: 'Single Selection (mutuallyExclusive):',
              variant: 'caption',
            },
            {
              id: 'single-select',
              component: 'ChoicePicker',
              label: 'Choose one',
              value: { path: '/singleSelection' },
              variant: 'mutuallyExclusive',
              options: [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' },
              ],
            },
            {
              id: 'multi-label',
              component: 'Text',
              text: 'Multiple Selection:',
              variant: 'caption',
            },
            {
              id: 'multi-select',
              component: 'ChoicePicker',
              label: 'Choose any',
              value: { path: '/multiSelection' },
              variant: 'multipleSelection',
              options: [
                { label: 'Red', value: 'red' },
                { label: 'Green', value: 'green' },
                { label: 'Blue', value: 'blue' },
                { label: 'Yellow', value: 'yellow' },
              ],
            },
          ],
        },
      },
      {
        updateDataModel: {
          surfaceId: 'main',
          path: '/',
          value: {
            singleSelection: [],
            multiSelection: [],
          },
        },
      },
    ],
  },
  {
    id: 'slider',
    title: 'Slider',
    description: 'Slider component with min/max range',
    group: 'Components',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: [
                'heading',
                'description',
                'volume-row',
                'progress-row',
              ],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Slider Component',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'Select values within a range using sliders.',
              variant: 'body',
            },
            {
              id: 'volume-row',
              component: 'Column',
              children: ['volume-slider', 'volume-value'],
            },
            {
              id: 'volume-slider',
              component: 'Slider',
              label: 'Volume (0-100)',
              value: { path: '/volume' },
              min: 0,
              max: 100,
            },
            {
              id: 'volume-value',
              component: 'Text',
              text: { path: '/volume' },
              variant: 'body',
            },
            {
              id: 'progress-row',
              component: 'Column',
              children: ['progress-slider', 'progress-value'],
            },
            {
              id: 'progress-slider',
              component: 'Slider',
              label: 'Progress (0-10)',
              value: { path: '/progress' },
              min: 0,
              max: 10,
            },
            {
              id: 'progress-value',
              component: 'Text',
              text: { path: '/progress' },
              variant: 'body',
            },
          ],
        },
      },
      {
        updateDataModel: {
          surfaceId: 'main',
          path: '/',
          value: {
            volume: 50,
            progress: 5,
          },
        },
      },
    ],
  },
  {
    id: 'tabs',
    title: 'Tabs',
    description: 'Tabs component for tabbed navigation',
    group: 'Components',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'description', 'tabs'],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Tabs Component',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'Navigate between different content sections.',
              variant: 'body',
            },
            {
              id: 'tabs',
              component: 'Tabs',
              tabs: [
                { title: 'Overview', child: 'tab1-content' },
                { title: 'Details', child: 'tab2-content' },
                { title: 'Settings', child: 'tab3-content' },
              ],
            },
            {
              id: 'tab1-content',
              component: 'Card',
              child: 'tab1-text',
            },
            {
              id: 'tab1-text',
              component: 'Text',
              text: 'This is the Overview tab content. It provides a high-level summary.',
              variant: 'body',
            },
            {
              id: 'tab2-content',
              component: 'Card',
              child: 'tab2-text',
            },
            {
              id: 'tab2-text',
              component: 'Text',
              text: 'This is the Details tab content. It shows more detailed information.',
              variant: 'body',
            },
            {
              id: 'tab3-content',
              component: 'Card',
              child: 'tab3-text',
            },
            {
              id: 'tab3-text',
              component: 'Text',
              text: 'This is the Settings tab content. Configure your preferences here.',
              variant: 'body',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'modal',
    title: 'Modal',
    description: 'Modal component for dialog overlays',
    group: 'Components',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'description', 'modal'],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Modal Component',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'Click the button below to open a modal dialog.',
              variant: 'body',
            },
            {
              id: 'modal',
              component: 'Modal',
              trigger: 'modal-trigger',
              content: 'modal-content',
            },
            {
              id: 'modal-trigger',
              component: 'Button',
              child: 'modal-trigger-text',
              primary: true,
              action: { name: 'open-modal' },
            },
            {
              id: 'modal-trigger-text',
              component: 'Text',
              text: 'Open Modal',
            },
            {
              id: 'modal-content',
              component: 'Column',
              children: ['modal-title', 'modal-body'],
            },
            {
              id: 'modal-title',
              component: 'Text',
              text: 'Modal Title',
              variant: 'h3',
            },
            {
              id: 'modal-body',
              component: 'Text',
              text: 'This is the modal content. You can put any components here.',
              variant: 'body',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'datetime-input',
    title: 'DateTime Input',
    description: 'DateTimeInput component for date and time selection',
    group: 'Components',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: [
                'heading',
                'description',
                'date-only',
                'time-only',
                'datetime',
              ],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'DateTime Input Component',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'Select dates and times with different configurations.',
              variant: 'body',
            },
            {
              id: 'date-only',
              component: 'DateTimeInput',
              label: 'Date Only',
              value: { path: '/dateOnly' },
              enableDate: true,
              enableTime: false,
            },
            {
              id: 'time-only',
              component: 'DateTimeInput',
              label: 'Time Only',
              value: { path: '/timeOnly' },
              enableDate: false,
              enableTime: true,
            },
            {
              id: 'datetime',
              component: 'DateTimeInput',
              label: 'Date and Time',
              value: { path: '/datetime' },
              enableDate: true,
              enableTime: true,
            },
          ],
        },
      },
      {
        updateDataModel: {
          surfaceId: 'main',
          path: '/',
          value: {
            dateOnly: '',
            timeOnly: '',
            datetime: '',
          },
        },
      },
    ],
  },
  {
    id: 'layout-row-column',
    title: 'Row & Column Layout',
    description: 'Row and Column components with justify and align options',
    group: 'Components',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'row-demo', 'column-demo'],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Row & Column Layout',
              variant: 'h2',
            },
            {
              id: 'row-demo',
              component: 'Card',
              child: 'row-content',
            },
            {
              id: 'row-content',
              component: 'Column',
              children: ['row-label', 'row-example'],
            },
            {
              id: 'row-label',
              component: 'Text',
              text: 'Row with justify: spaceEvenly',
              variant: 'caption',
            },
            {
              id: 'row-example',
              component: 'Row',
              children: ['box1', 'box2', 'box3'],
              justify: 'spaceEvenly',
              align: 'center',
            },
            {
              id: 'box1',
              component: 'Card',
              child: 'box1-text',
            },
            {
              id: 'box1-text',
              component: 'Text',
              text: 'Box 1',
            },
            {
              id: 'box2',
              component: 'Card',
              child: 'box2-text',
            },
            {
              id: 'box2-text',
              component: 'Text',
              text: 'Box 2',
            },
            {
              id: 'box3',
              component: 'Card',
              child: 'box3-text',
            },
            {
              id: 'box3-text',
              component: 'Text',
              text: 'Box 3',
            },
            {
              id: 'column-demo',
              component: 'Card',
              child: 'column-content',
            },
            {
              id: 'column-content',
              component: 'Column',
              children: ['column-label', 'column-example'],
            },
            {
              id: 'column-label',
              component: 'Text',
              text: 'Column with align: center',
              variant: 'caption',
            },
            {
              id: 'column-example',
              component: 'Column',
              children: ['col-box1', 'col-box2'],
              align: 'center',
            },
            {
              id: 'col-box1',
              component: 'Card',
              child: 'col-box1-text',
            },
            {
              id: 'col-box1-text',
              component: 'Text',
              text: 'Centered Item 1',
            },
            {
              id: 'col-box2',
              component: 'Card',
              child: 'col-box2-text',
            },
            {
              id: 'col-box2-text',
              component: 'Text',
              text: 'Centered Item 2',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'icon',
    title: 'Icon',
    description: 'Icon component displaying various icons',
    group: 'Components',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'description', 'icons-row'],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Icon Component',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'Display icons by name from the icon library.',
              variant: 'body',
            },
            {
              id: 'icons-row',
              component: 'Row',
              children: [
                'icon-home',
                'icon-settings',
                'icon-user',
                'icon-search',
              ],
              justify: 'spaceEvenly',
            },
            {
              id: 'icon-home',
              component: 'Icon',
              name: 'home',
            },
            {
              id: 'icon-settings',
              component: 'Icon',
              name: 'settings',
            },
            {
              id: 'icon-user',
              component: 'Icon',
              name: 'accountCircle',
            },
            {
              id: 'icon-search',
              component: 'Icon',
              name: 'search',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'image',
    title: 'Image',
    description: 'Image component with different fit modes and variants',
    group: 'Components',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['heading', 'description', 'images-row'],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Image Component',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'Display images with various fit modes and variants.',
              variant: 'body',
            },
            {
              id: 'images-row',
              component: 'Row',
              children: ['image-contain', 'image-cover'],
              justify: 'spaceEvenly',
            },
            {
              id: 'image-contain',
              component: 'Image',
              url: 'https://picsum.photos/200/150',
              fit: 'contain',
              variant: 'smallFeature',
            },
            {
              id: 'image-cover',
              component: 'Image',
              url: 'https://picsum.photos/200/151',
              fit: 'cover',
              variant: 'smallFeature',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'interpolation',
    title: 'Interpolation',
    description: 'String interpolation with ${path} syntax for dynamic text',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: [
                'heading',
                'description',
                'user-card',
                'input-section',
                'stats-card',
              ],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'String Interpolation Demo',
              variant: 'h2',
            },
            {
              id: 'description',
              component: 'Text',
              text: 'V0.9 supports \\${path} syntax to embed data model values directly in strings.',
              variant: 'body',
            },
            {
              id: 'user-card',
              component: 'Card',
              child: 'user-content',
            },
            {
              id: 'user-content',
              component: 'Column',
              children: ['greeting', 'user-info', 'status'],
            },
            {
              id: 'greeting',
              component: 'Text',
              text: 'Hello, ${/user/name}!',
              variant: 'h3',
            },
            {
              id: 'user-info',
              component: 'Text',
              text: 'Email: ${/user/email} | Role: ${/user/role}',
              variant: 'body',
            },
            {
              id: 'status',
              component: 'Text',
              text: 'Account created on ${/user/createdAt}',
              variant: 'caption',
            },
            {
              id: 'input-section',
              component: 'Column',
              children: ['input-label', 'name-input', 'preview'],
            },
            {
              id: 'input-label',
              component: 'Text',
              text: 'Try changing the name:',
              variant: 'caption',
            },
            {
              id: 'name-input',
              component: 'TextField',
              label: 'Name',
              value: { path: '/user/name' },
            },
            {
              id: 'preview',
              component: 'Text',
              text: 'Preview: Welcome back, ${/user/name}! You have ${/stats/unread} unread messages.',
              variant: 'body',
            },
            {
              id: 'stats-card',
              component: 'Card',
              child: 'stats-content',
            },
            {
              id: 'stats-content',
              component: 'Column',
              children: ['stats-title', 'stats-row'],
            },
            {
              id: 'stats-title',
              component: 'Text',
              text: 'Statistics for ${/user/name}',
              variant: 'h4',
            },
            {
              id: 'stats-row',
              component: 'Row',
              children: ['stat1', 'stat2', 'stat3'],
              justify: 'spaceEvenly',
            },
            {
              id: 'stat1',
              component: 'Text',
              text: '${/stats/posts} posts',
              variant: 'body',
            },
            {
              id: 'stat2',
              component: 'Text',
              text: '${/stats/followers} followers',
              variant: 'body',
            },
            {
              id: 'stat3',
              component: 'Text',
              text: '${/stats/following} following',
              variant: 'body',
            },
          ],
        },
      },
      {
        updateDataModel: {
          surfaceId: 'main',
          path: '/',
          value: {
            user: {
              name: 'Alice',
              email: 'alice@example.com',
              role: 'Admin',
              createdAt: '2024-01-15',
            },
            stats: {
              posts: 42,
              followers: 1280,
              following: 350,
              unread: 5,
            },
          },
        },
      },
    ],
  },
  {
    id: 'divider',
    title: 'Divider',
    description: 'Divider component for visual separation',
    group: 'Components',
    messages: [
      {
        createSurface: {
          surfaceId: 'main',
          catalogId: 'standard',
        },
      },
      {
        updateComponents: {
          surfaceId: 'main',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: [
                'heading',
                'section1',
                'divider-h',
                'section2',
                'vertical-demo',
              ],
            },
            {
              id: 'heading',
              component: 'Text',
              text: 'Divider Component',
              variant: 'h2',
            },
            {
              id: 'section1',
              component: 'Text',
              text: 'Content above horizontal divider',
              variant: 'body',
            },
            {
              id: 'divider-h',
              component: 'Divider',
              axis: 'horizontal',
            },
            {
              id: 'section2',
              component: 'Text',
              text: 'Content below horizontal divider',
              variant: 'body',
            },
            {
              id: 'vertical-demo',
              component: 'Row',
              children: ['left-text', 'divider-v', 'right-text'],
              align: 'stretch',
            },
            {
              id: 'left-text',
              component: 'Text',
              text: 'Left',
              variant: 'body',
            },
            {
              id: 'divider-v',
              component: 'Divider',
              axis: 'vertical',
            },
            {
              id: 'right-text',
              component: 'Text',
              text: 'Right',
              variant: 'body',
            },
          ],
        },
      },
    ],
  },
]
