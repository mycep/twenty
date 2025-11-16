export type ConnectionType = 'social_networks' | 'sms' | 'phone' | 'email';

export type ConnectionProvider =
  | 'google'
  | 'microsoft'
  | 'sms_ir'
  | 'imap_smtp_caldav';

export type ConnectionTypeConfig = {
  type: ConnectionType;
  label: string;
  providers: {
    value: ConnectionProvider;
    label: string;
  }[];
};

export const CONNECTION_TYPES: ConnectionTypeConfig[] = [
  {
    type: 'social_networks',
    label: 'Social Networks',
    providers: [
      { value: 'google', label: 'Google' },
      { value: 'microsoft', label: 'Microsoft' },
    ],
  },
  {
    type: 'sms',
    label: 'SMS',
    providers: [
      { value: 'sms_ir', label: 'sms.ir' },
    ],
  },
  {
    type: 'phone',
    label: 'Phone',
    providers: [],
  },
  {
    type: 'email',
    label: 'Email',
    providers: [
      { value: 'imap_smtp_caldav', label: 'IMAP/SMTP/CalDAV' },
    ],
  },
];



