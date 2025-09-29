import type { Company } from '@/store/api/company';
import type { RootState } from '@/store/store';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import moment from 'moment';
import { toast } from 'sonner';
import { DATE_FORMATE } from './constant';

export const createBaseQuery = (baseUrl: string) => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.token || localStorage.getItem('token');

      if (token) {
        headers.set('token', token);
      }

      headers.set('content-type', 'application/json');

      return headers;
    }
  });
};

export function formatDate(date: string, format?: string) {
  if (!date) return '-';
  return moment(date).format(format || DATE_FORMATE.DEFAULT);
}

export const handleStatusesBadge = (status: string) => {
  if (!status) return '';

  const baseClasses =
    'w-fit font-semibold text-xs whitespace-nowrap capitalize';

  switch (status) {
    case 'pending':
      return `${baseClasses} bg-[#fee2e2] text-[#ef4444] rounded-lg px-2 py-0.5`;

    case 'in process':
      return `${baseClasses} bg-[#dbeafe] text-[#0ea5e9] rounded-lg px-2 py-0.5`;

    case 'closed':
      return `${baseClasses} bg-[#d1fae5] text-[#16a34a] rounded-lg px-2 py-0.5`;

    case 'headerBadge-pending':
      return `${baseClasses} bg-[#fee2e2] text-[#ef4444] rounded-lg px-3 py-1 h-6`;

    case 'headerBadge-in process':
      return `${baseClasses} bg-[#dbeafe] text-[#0ea5e9] rounded-lg px-3 py-1 h-6`;

    default:
      return baseClasses;
  }
};

export const successToast = (message: string) => {
  if (typeof window !== 'undefined' && document.readyState === 'complete') {
    toast.success(message);
  } else {
    setTimeout(() => toast.success(message), 100);
  }
};

export const errorToast = (message: string) => {
  if (typeof window !== 'undefined' && document.readyState === 'complete') {
    toast.error(message);
  } else {
    setTimeout(() => toast.error(message), 100);
  }
};

export const handleIssueDate = (item: Company, sort?: string) => {
  if (!item?.amc || !item?.amc?.length) return null;

  const amcArr = item?.amc;
  if (!amcArr.length) return null;

  const latestAmc = amcArr.reduce((latest, current) => {
    const latestDate = new Date(latest.end_date);
    const currentDate = new Date(current.end_date);
    return currentDate > latestDate ? current : latest;
  });

  const formattedDate = formatDate(latestAmc?.end_date);
  if (sort) return formattedDate;

  const days = latestAmc?.days;
  let tagColor = '';
  if (days > 60) {
    tagColor = '#a8fc58';
  } else if (days > 30 && days <= 60) {
    tagColor = '#f3f700';
  } else if (days >= 0 && days <= 30) {
    tagColor = '#f0aa29';
  } else {
    tagColor = '#F79E9F';
  }

  return {
    formattedDate,
    tagColor
  };
};

export const handleDays = (item: Company) => {
  if (!item?.amc || !item?.amc?.length) return '-';
  const amcArr = item?.amc;

  if (amcArr.length > 0) {
    const latestAmc = amcArr.reduce((latest, current) => {
      const latestDate = new Date(latest.end_date);
      const currentDate = new Date(current.end_date);
      return currentDate > latestDate ? current : latest;
    });
    return latestAmc?.days;
  } else {
    return '-';
  }
};
