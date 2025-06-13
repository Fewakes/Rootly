import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Users } from 'lucide-react';

type Contact = {
  id: string;
  name: string;
  avatar_url: string;
  contact_tags: { id: string; name: string; color: string | null }[];
};

type RecentContactsProps = {
  recentContacts: Contact[]; // This line is likely missing or incorrect in your file
  getTagBgClass: (color: string) => string;
  getTagTextClass: (color: string) => string;
};
const RecentContacts = ({
  recentContacts,
  getTagBgClass,
  getTagTextClass,
}: RecentContactsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Recently Added Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentContacts.length > 0 ? (
          <div className="space-y-3">
            {recentContacts.map(contact => (
              <div
                key={contact.id}
                className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatar_url}
                    alt={`${contact.name}`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      {contact.name}
                    </span>
                    <div className="flex gap-1 flex-wrap text-xs text-muted-foreground mt-1">
                      {contact.contact_tags &&
                      contact.contact_tags.length > 0 ? (
                        contact.contact_tags.slice(0, 3).map(
                          (
                            t, // Show up to 3 tags
                          ) => (
                            <Badge
                              key={t.id}
                              variant="outline"
                              className={`${getTagBgClass(t.color || '')} ${getTagTextClass(t.color || '')} border-none shadow-sm px-2 py-0.5`}
                            >
                              {t.name}
                            </Badge>
                          ),
                        )
                      ) : (
                        <span className="italic">No tags</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-sm" asChild>
                  <Link to={`/contacts/${contact.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic text-center py-10">
            No recent contacts to display.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end border-t px-6 ">
        <Button
          variant="link"
          size="sm"
          className="p-0 text-sm text-primary"
          asChild
        >
          <Link to="/contacts">
            View All Contacts <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentContacts;
