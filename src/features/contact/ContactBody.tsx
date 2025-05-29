import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Contact() {
  return (
    <Tabs defaultValue="notes" className="w-full">
      <TabsList>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="professional">Professional</TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        <Card>
          <CardContent className="p-4">
            This is example note content.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tasks">
        <Card>
          <CardContent className="p-4">
            This is example task content.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="professional">
        <Card>
          <CardContent className="p-4">
            This is example professional content.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
