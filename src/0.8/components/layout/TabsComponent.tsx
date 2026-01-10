/**
 * TabsComponent - Tabbed content container.
 */

import { memo } from 'react'
import type { TabsComponentProps } from '../../types'
import { useDataBinding } from '../../hooks/useDataBinding'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../../components/ui/tabs'
import { ComponentRenderer } from '../ComponentRenderer'

/**
 * Tabs component - tabbed content container.
 */
export const TabsComponent = memo(function TabsComponent({
  surfaceId,
  tabItems,
}: TabsComponentProps) {
  if (!tabItems || tabItems.length === 0) {
    return null
  }

  // Get the first tab as default
  const defaultTab = tabItems[0].child

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList>
        {tabItems.map((item, index) => (
          <TabsTrigger key={item.child} value={item.child}>
            <TabTitle surfaceId={surfaceId} title={item.title} index={index} />
          </TabsTrigger>
        ))}
      </TabsList>
      {tabItems.map((item) => (
        <TabsContent key={item.child} value={item.child}>
          <ComponentRenderer surfaceId={surfaceId} componentId={item.child} />
        </TabsContent>
      ))}
    </Tabs>
  )
})

/**
 * Helper component to resolve tab titles.
 */
function TabTitle({
  surfaceId,
  title,
  index,
}: {
  surfaceId: string
  title: TabsComponentProps['tabItems'] extends Array<infer T>
    ? T extends { title?: infer U }
      ? U
      : never
    : never
  index: number
}) {
  const titleText = useDataBinding<string>(surfaceId, title, `Tab ${index + 1}`)
  return <>{titleText}</>
}

TabsComponent.displayName = 'A2UI.Tabs'
