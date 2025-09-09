export const PAGINATION_LIMIT = 500;

export const DATE_FORMATE = {
  DEFAULT: 'DD-MM-YYYY',
  WITH_TIME: 'DD-MM-YYYY hh:mm A'
};

export const SERVICE_STATUS = {
  PENDING: 'Pending',
  IN_PROCESS: 'In Process',
  CLOSED: 'Closed',
  BLOCKED: 'Blocked'
};

export const SERVICE_STATUS_OPTIONS = [
  { label: 'Pending', value: SERVICE_STATUS.PENDING },
  { label: 'In Progress', value: SERVICE_STATUS.IN_PROCESS },
  { label: 'Closed', value: SERVICE_STATUS.CLOSED },
  { label: 'Blocked', value: SERVICE_STATUS.BLOCKED }
];

export const INQUIRY_STATUS = {
  ALL: 'all',
  IN_PROGRESS: 'in progress',
  ACCEPTED: 'accepted',
  DENIED: 'denied'
};

export const INQUIRY_STATUS_OPTIONS = [
  { label: 'All', value: INQUIRY_STATUS.ALL },
  { label: 'In Progress', value: INQUIRY_STATUS.IN_PROGRESS },
  { label: 'Accepted', value: INQUIRY_STATUS.ACCEPTED },
  { label: 'Denied', value: INQUIRY_STATUS.DENIED }
];
