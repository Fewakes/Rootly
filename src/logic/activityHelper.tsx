import {
  User,
  Users,
  Tag,
  Building,
  FileText,
  Edit,
  Trash2,
  UserPlus,
  PlusCircle,
  CheckSquare,
  History,
  XCircle,
} from 'lucide-react';

type ActivityLogEntry = {
  action: string;
  details: Record<string, any>;
};

export const getActivityIcon = (action: string): JSX.Element => {
  const commonProps = { className: 'h-5 w-5 flex-shrink-0' };
  const normalizedAction = action?.toUpperCase() || '';

  switch (normalizedAction) {
    case 'CONTACT_CREATED':
      return <UserPlus {...commonProps} className="text-green-500" />;

    // Edit Actions
    case 'CONTACT_UPDATED':
    case 'GROUP_EDITED':
    case 'TAG_EDITED':
    case 'COMPANY_EDITED':
    case 'NOTE_EDITED':
    case 'TASK_EDITED':
    case 'COMPANY_NOTE_EDITED':
    case 'GROUP_NOTE_EDITED':
    case 'TAG_NOTE_EDITED':
    case 'COMPANY_TASK_EDITED':
    case 'GROUP_TASK_EDITED':
    case 'TAG_TASK_EDITED':
      return <Edit {...commonProps} className="text-blue-500" />;

    // Delete Actions
    case 'CONTACT_DELETED':
    case 'GROUP_REMOVED':
    case 'TAG_REMOVED':
    case 'COMPANY_REMOVED':
    case 'NOTE_REMOVED':
    case 'TASK_REMOVED':
    case 'COMPANY_NOTE_REMOVED':
    case 'GROUP_NOTE_REMOVED':
    case 'TAG_NOTE_REMOVED':
    case 'COMPANY_TASK_REMOVED':
    case 'GROUP_TASK_REMOVED':
    case 'TAG_TASK_REMOVED':
      return <Trash2 {...commonProps} className="text-red-500" />;

    // Tag Actions
    case 'TAG_ASSIGNED':
    case 'TAG_CREATED':
      return <Tag {...commonProps} className="text-purple-500" />;

    // Group Actions
    case 'GROUP_ASSIGNED':
    case 'GROUP_CREATED':
      return <Users {...commonProps} className="text-orange-500" />;

    // Company Actions
    case 'COMPANY_ASSIGNED':
    case 'COMPANY_CREATED':
      return <Building {...commonProps} className="text-indigo-500" />;

    // Note Actions
    case 'NOTE_CREATED':
    case 'COMPANY_NOTE_CREATED':
    case 'GROUP_NOTE_CREATED':
    case 'TAG_NOTE_CREATED':
      return <FileText {...commonProps} className="text-yellow-600" />;

    // Task Actions
    case 'TASK_CREATED':
    case 'COMPANY_TASK_CREATED':
    case 'GROUP_TASK_CREATED':
    case 'TAG_TASK_CREATED':
      return <PlusCircle {...commonProps} className="text-sky-500" />;

    // Task Status Actions
    case 'TASK_COMPLETED':
    case 'COMPANY_TASK_COMPLETED':
    case 'GROUP_TASK_COMPLETED':
    case 'TAG_TASK_COMPLETED':
      return <CheckSquare {...commonProps} className="text-green-500" />;
    case 'TASK_REOPENED':
    case 'COMPANY_TASK_REOPENED':
    case 'GROUP_TASK_REOPENED':
    case 'TAG_TASK_REOPENED':
      return <History {...commonProps} className="text-gray-500" />;

    // Unassignment Actions
    case 'GROUP_UNASSIGNED':
    case 'TAG_UNASSIGNED':
    case 'COMPANY_UNASSIGNED':
      return <XCircle {...commonProps} className="text-gray-500" />;

    default:
      return <User {...commonProps} className="text-gray-400" />;
  }
};

export const formatActivityDetails = (
  activity: ActivityLogEntry,
): JSX.Element => {
  const { action, details } = activity;
  const Name = ({ children }: { children: React.ReactNode }) => (
    <span className="font-semibold text-foreground">{children}</span>
  );
  const normalizedAction = action?.toUpperCase() || '';

  switch (normalizedAction) {
    case 'CONTACT_CREATED':
    case 'CONTACT_UPDATED':
    case 'CONTACT_DELETED':
      return (
        <>
          Contact: <Name>{details?.name || 'N/A'}</Name>
        </>
      );

    case 'NOTE_CREATED':
    case 'NOTE_REMOVED':
    case 'NOTE_EDITED':
    case 'TASK_CREATED':
    case 'TASK_COMPLETED':
    case 'TASK_EDITED':
    case 'TASK_REMOVED':
    case 'TASK_REOPENED':
      return (
        <>
          On Contact: <Name>{details?.contactName}</Name>
        </>
      );

    // New cases for entity-specific activities
    case 'COMPANY_NOTE_CREATED':
    case 'COMPANY_NOTE_EDITED':
    case 'COMPANY_NOTE_REMOVED':
    case 'COMPANY_TASK_CREATED':
    case 'COMPANY_TASK_EDITED':
    case 'COMPANY_TASK_REMOVED':
    case 'COMPANY_TASK_COMPLETED':
    case 'COMPANY_TASK_REOPENED':
      return (
        <>
          On Company: <Name>{details?.companyName}</Name>
        </>
      );

    case 'GROUP_NOTE_CREATED':
    case 'GROUP_NOTE_EDITED':
    case 'GROUP_NOTE_REMOVED':
    case 'GROUP_TASK_CREATED':
    case 'GROUP_TASK_EDITED':
    case 'GROUP_TASK_REMOVED':
    case 'GROUP_TASK_COMPLETED':
    case 'GROUP_TASK_REOPENED':
      return (
        <>
          On Group: <Name>{details?.groupName}</Name>
        </>
      );

    case 'TAG_NOTE_CREATED':
    case 'TAG_NOTE_EDITED':
    case 'TAG_NOTE_REMOVED':
    case 'TAG_TASK_CREATED':
    case 'TAG_TASK_EDITED':
    case 'TAG_TASK_REMOVED':
    case 'TAG_TASK_COMPLETED':
    case 'TAG_TASK_REOPENED':
      return (
        <>
          On Tag: <Name>{details?.tagName}</Name>
        </>
      );

    case 'GROUP_ASSIGNED':
    case 'GROUP_UNASSIGNED':
      return (
        <>
          Group <Name>{details?.groupName}</Name> on{' '}
          <Name>{details?.contactName}</Name>
        </>
      );

    case 'GROUP_CREATED':
    case 'GROUP_REMOVED':
    case 'GROUP_EDITED':
      return (
        <>
          Group: <Name>{details?.groupName}</Name>
        </>
      );

    case 'TAG_ASSIGNED':
    case 'TAG_UNASSIGNED':
      return (
        <>
          Tag <Name>{details?.tagName}</Name> on{' '}
          <Name>{details?.contactName}</Name>
        </>
      );

    case 'TAG_CREATED':
    case 'TAG_REMOVED':
    case 'TAG_EDITED':
      return (
        <>
          Tag: <Name>{details?.tagName}</Name>
        </>
      );

    case 'COMPANY_ASSIGNED':
    case 'COMPANY_UNASSIGNED':
      return (
        <>
          Company <Name>{details?.companyName}</Name> on{' '}
          <Name>{details?.contactName}</Name>
        </>
      );

    case 'COMPANY_CREATED':
    case 'COMPANY_REMOVED':
    case 'COMPANY_EDITED':
      return (
        <>
          Company: <Name>{details?.companyName}</Name>
        </>
      );

    default:
      return <>No details available.</>;
  }
};
