/**
 * TabsComponent - Tabbed content container.
 * Note: In 0.9, tabItems is renamed to tabs.
 */

import { memo } from 'react'
import type { DynamicString } from '@a2ui-sdk/types/0.9'
import type { TabsComponentProps } from '@a2ui-sdk/types/0.9/standard-catalog'
import type { A2UIComponentProps } from '@/0.9/components/types'
import { useStringBinding } from '../../hooks/useDataBinding'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ComponentRenderer } from '../ComponentRenderer'

/**
 * Helper component to resolve tab titles.
 */
function TabTitle({
  surfaceId,
  title,
  index,
}: {
  surfaceId: string
  title: DynamicString | undefined
  index: number
}) {
  const titleText = useStringBinding(surfaceId, title, `Tab ${index + 1}`)
  return <>{titleText}</>
}

/**
 * Tabs component - tabbed content container.
 */
export const TabsComponent = memo(function TabsComponent({
  surfaceId,
  tabs,
  weight,
}: A2UIComponentProps<TabsComponentProps>) {
  if (!tabs || tabs.length === 0) {
    return null
  }

  // Apply weight as flex-grow if set
  const style = weight ? { flexGrow: weight } : undefined

  // Get the first tab as default
  const defaultTab = tabs[0].child

  return (
    <Tabs defaultValue={defaultTab} className="w-full" style={style}>
      <TabsList>
        {tabs.map((item, index) => (
          <TabsTrigger key={item.child} value={item.child}>
            <TabTitle surfaceId={surfaceId} title={item.title} index={index} />
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((item) => (
        <TabsContent key={item.child} value={item.child}>
          <ComponentRenderer surfaceId={surfaceId} componentId={item.child} />
        </TabsContent>
      ))}
    </Tabs>
  )
})

TabsComponent.displayName = 'A2UI.Tabs'
